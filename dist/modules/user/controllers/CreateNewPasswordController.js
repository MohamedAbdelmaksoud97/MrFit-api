"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewPasswordController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class CreateNewPasswordController {
    createNewPasswordUseCase;
    constructor(createNewPasswordUseCase) {
        this.createNewPasswordUseCase = createNewPasswordUseCase;
    }
    createNewPassword = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const { token } = req.params;
        const { newPassword, newPasswordConfirmation } = req.body;
        // Type guard for the token
        if (!token || typeof token !== "string") {
            throw new AppError_1.AppError("A valid reset token is required.", 400);
        }
        // Execute the Business Logic
        await this.createNewPasswordUseCase.execute(token, newPassword, newPasswordConfirmation);
        // Send Success Response
        return res.status(200).json({
            success: true,
            message: "Password updated successfully. You can now log in with your new password.",
        });
    });
}
exports.CreateNewPasswordController = CreateNewPasswordController;
