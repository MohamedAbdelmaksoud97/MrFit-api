"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendVerificationEmailController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class ResendVerificationEmailController {
    resendVerificationEmailUseCase;
    constructor(resendVerificationEmailUseCase) {
        this.resendVerificationEmailUseCase = resendVerificationEmailUseCase;
    }
    // Wrap with catchAsync to delegate error handling to GlobalErrorHandler
    resendToken = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const { email } = req.body;
        if (!email) {
            throw new AppError_1.AppError("Email address is required.", 400);
        }
        // Execute the Use Case
        await this.resendVerificationEmailUseCase.execute(email);
        // Standardized Success Response
        return res.status(200).json({
            success: true,
            message: "Verification link has been resent to your email.",
        });
    });
}
exports.ResendVerificationEmailController = ResendVerificationEmailController;
