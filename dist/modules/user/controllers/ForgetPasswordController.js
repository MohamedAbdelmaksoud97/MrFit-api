"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetPasswordController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
class ForgetPasswordController {
    forgetPasswordUseCase;
    constructor(forgetPasswordUseCase) {
        this.forgetPasswordUseCase = forgetPasswordUseCase;
    }
    // Use Arrow Function + catchAsync
    forgetPassword = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const { email } = req.body;
        // Execute Use Case
        await this.forgetPasswordUseCase.execute(email);
        // Success Response
        return res.status(200).json({
            success: true,
            message: "Password reset link has been sent to your email.",
        });
    });
}
exports.ForgetPasswordController = ForgetPasswordController;
