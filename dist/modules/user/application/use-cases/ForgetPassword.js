"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetPassword = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class ForgetPassword {
    userRepository;
    tokenService;
    mailService;
    constructor(userRepository, tokenService, mailService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.mailService = mailService;
    }
    async execute(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError("No user found with that email address.", 404);
        }
        const resetToken = await this.tokenService.generateToken(user.getId());
        await this.mailService.sendResetPasswordEmail(email, resetToken);
    }
}
exports.ForgetPassword = ForgetPassword;
