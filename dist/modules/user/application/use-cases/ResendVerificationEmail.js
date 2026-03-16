"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendVerificationEmail = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class ResendVerificationEmail {
    userRepository;
    tokenService;
    emailSender;
    constructor(userRepository, tokenService, emailSender) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.emailSender = emailSender;
    }
    async execute(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError("No user found with this email address.", 404);
        }
        if (user.getVerificationStatus()) {
            throw new AppError_1.AppError("This account is already verified. Please log in.", 400);
        }
        const token = await this.tokenService.generateToken(user.getId());
        await this.emailSender.sendActivationEmail(email, token);
    }
}
exports.ResendVerificationEmail = ResendVerificationEmail;
