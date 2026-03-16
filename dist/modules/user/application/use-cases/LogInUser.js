"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogInUser = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class LogInUser {
    userRepository;
    hasher;
    tokenService;
    constructor(userRepository, hasher, tokenService) {
        this.userRepository = userRepository;
        this.hasher = hasher;
        this.tokenService = tokenService;
    }
    async execute(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        const isPasswordValid = await this.hasher.compare(password, user.getPassword());
        if (!isPasswordValid) {
            throw new AppError_1.AppError("Invalid email or password", 401);
        }
        if (!user.getVerificationStatus()) {
            throw new AppError_1.AppError("Please activate your account first. Check your email.", 403);
        }
        const token = await this.tokenService.generateToken(user.getId());
        return token;
    }
}
exports.LogInUser = LogInUser;
