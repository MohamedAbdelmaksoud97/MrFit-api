import { Request, Response, NextFunction } from "express";
import { LogInUser } from "../application/use-cases/LogInUser";
import { TokenResponseHandler } from "../infrastructure/services/TokenResponseHandler";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";

export class LogInUserController {
  constructor(private logInUserUseCase: LogInUser) {}

  // استخدام catchAsync يغنينا عن try/catch ويبعث الأخطاء للـ GlobalErrorHandler
  login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // تنفيذ الـ Use Case
    const token = await this.logInUserUseCase.execute(email, password);

    // إرسال الرد بنجاح
    return TokenResponseHandler.send(res, token, "Login successful");
  });
}
