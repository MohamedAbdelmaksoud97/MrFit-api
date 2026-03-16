"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUser = void 0;
const RequestObjectToEntityConverter_1 = require("../mappers/RequestObjectToEntityConverter");
const EntityToResponseConverter_1 = require("../mappers/EntityToResponseConverter");
const AppError_1 = require("../../../../shared/domain/errors/AppError");
// Import the Password Value Object
const Password_1 = require("../../domain/valueObjects/Password");
class RegisterUser {
    userRepository;
    hasher;
    tokenService;
    emailSender;
    constructor(userRepository, hasher, tokenService, emailSender) {
        this.userRepository = userRepository;
        this.hasher = hasher;
        this.tokenService = tokenService;
        this.emailSender = emailSender;
    }
    async execute(dto) {
        const securePassword = Password_1.Password.create(dto.password);
        const isEmailTaken = await this.userRepository.exists(dto.email);
        if (isEmailTaken) {
            throw new AppError_1.AppError("This email is already registered", 400);
        }
        const passwordHash = await this.hasher.hash(securePassword.getValue());
        const userEntity = RequestObjectToEntityConverter_1.RequestObjectToEntityConverter.toEntity(dto, passwordHash);
        console.log(userEntity);
        await this.userRepository.save(userEntity);
        const token = await this.tokenService.generateToken(userEntity.getId());
        await this.emailSender.sendActivationEmail(userEntity.getEmail(), token);
        return EntityToResponseConverter_1.EntityToResponseConverter.toDTO(userEntity);
    }
}
exports.RegisterUser = RegisterUser;
