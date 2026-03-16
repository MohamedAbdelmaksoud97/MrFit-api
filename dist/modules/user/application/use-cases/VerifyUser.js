"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUser = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class VerifyUser {
    userRepository;
    tokenService;
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    async execute(token) {
        const payload = (await this.tokenService.verifyToken(token));
        console.log("Decoded Token Payload:", payload); // Debugging log
        if (!payload || !payload.sub) {
            throw new AppError_1.AppError("Invalid or expired activation link.", 401);
        }
        const user = await this.userRepository.findById(payload.sub);
        if (!user) {
            throw new AppError_1.AppError("User not found.", 404);
        }
        if (user.getVerificationStatus()) {
            throw new AppError_1.AppError("Account is already verified. Please log in.", 400);
        }
        user.setVerified(true);
        await this.userRepository.save(user);
    }
}
exports.VerifyUser = VerifyUser;
