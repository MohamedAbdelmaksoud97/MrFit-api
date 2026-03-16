"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePasswordController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class UpdatePasswordController {
    updatePasswordUseCase;
    constructor(updatePasswordUseCase) {
        this.updatePasswordUseCase = updatePasswordUseCase;
    }
    updatePassword = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const user = req.user;
        if (!user) {
            throw new AppError_1.AppError("Authentication required to update password.", 401);
        }
        const { currentPassword, newPassword, newPasswordConfirmation } = req.body;
        await this.updatePasswordUseCase.execute(user, currentPassword, newPassword, newPasswordConfirmation);
        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    });
}
exports.UpdatePasswordController = UpdatePasswordController;
