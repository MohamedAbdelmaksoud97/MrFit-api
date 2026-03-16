"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogInUserController = void 0;
const TokenResponseHandler_1 = require("../infrastructure/services/TokenResponseHandler");
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
class LogInUserController {
    logInUserUseCase;
    constructor(logInUserUseCase) {
        this.logInUserUseCase = logInUserUseCase;
    }
    // استخدام catchAsync يغنينا عن try/catch ويبعث الأخطاء للـ GlobalErrorHandler
    login = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const { email, password } = req.body;
        // تنفيذ الـ Use Case
        const token = await this.logInUserUseCase.execute(email, password);
        // إرسال الرد بنجاح
        return TokenResponseHandler_1.TokenResponseHandler.send(res, token, "Login successful");
    });
}
exports.LogInUserController = LogInUserController;
