"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePassword = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
const Password_1 = require("../../domain/valueObjects/Password");
class UpdatePassword {
    userRepository;
    hasher;
    constructor(userRepository, hasher) {
        this.userRepository = userRepository;
        this.hasher = hasher;
    }
    async execute(user, currentPassword, newPassword, newPasswordConfirmation) {
        if (newPassword !== newPasswordConfirmation) {
            throw new AppError_1.AppError("New passwords do not match.", 400);
        }
        const validatedPassword = Password_1.Password.create(newPassword);
        const isMatch = await this.hasher.compare(currentPassword, user.getPassword());
        if (!isMatch) {
            throw new AppError_1.AppError("The current password you entered is incorrect.", 401);
        }
        const newPasswordHash = await this.hasher.hash(validatedPassword.getValue());
        user.setPassword(newPasswordHash);
        user.setPasswordUpdatedAt(new Date());
        await this.userRepository.save(user);
    }
}
exports.UpdatePassword = UpdatePassword;
