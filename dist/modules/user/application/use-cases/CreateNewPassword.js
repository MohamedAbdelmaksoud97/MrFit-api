"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewPassword = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
// 1. Import your Password Value Object
const Password_1 = require("../../domain/valueObjects/Password");
class CreateNewPassword {
    userRepository;
    tokenService;
    hasher;
    constructor(userRepository, tokenService, hasher) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.hasher = hasher;
    }
    async execute(token, newPassword, newPasswordConfirmation) {
        // 2. Cross-check Confirmation (Business Logic)
        if (newPassword !== newPasswordConfirmation) {
            throw new AppError_1.AppError("Passwords do not match.", 400);
        }
        // 3. Enforce Complexity via Value Object (The Domain Rule)
        // This will throw an AppError if the password is < 8 chars, lacks uppercase, etc.
        const securePassword = Password_1.Password.create(newPassword);
        // 4. Token Verification
        const payload = await this.tokenService.verifyToken(token);
        if (!payload || !payload.sub) {
            throw new AppError_1.AppError("Invalid or expired reset token.", 401);
        }
        // 5. User Existence Check
        const user = await this.userRepository.findById(payload.sub);
        if (!user) {
            throw new AppError_1.AppError("User no longer exists.", 404);
        }
        // 6. Hashing & Updating (The Secure Flow)
        const newPasswordHash = await this.hasher.hash(securePassword.getValue());
        user.setPassword(newPasswordHash);
        user.setPasswordUpdatedAt(new Date());
        await this.userRepository.save(user);
    }
}
exports.CreateNewPassword = CreateNewPassword;
