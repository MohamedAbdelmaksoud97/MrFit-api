"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUserController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class VerifyUserController {
    verifyUserUseCase;
    constructor(verifyUserUseCase) {
        this.verifyUserUseCase = verifyUserUseCase;
    }
    verify = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const { token } = req.query;
        if (!token || typeof token !== "string") {
            throw new AppError_1.AppError("A valid activation token is required.", 400);
        }
        await this.verifyUserUseCase.execute(token);
        return res.status(200).json({
            success: true,
            message: "Your account has been successfully verified! You can now log in.",
        });
    });
}
exports.VerifyUserController = VerifyUserController;
