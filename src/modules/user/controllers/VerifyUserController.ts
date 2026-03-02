import { Request, Response, NextFunction } from "express";
import { VerifyUser } from "../application/use-cases/VerifyUser";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { AppError } from "../../../shared/domain/errors/AppError";

export class VerifyUserController {
  constructor(private verifyUserUseCase: VerifyUser) {}

  verify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      throw new AppError("A valid activation token is required.", 400);
    }

    await this.verifyUserUseCase.execute(token);

    return res.status(200).json({
      success: true,
      message: "Your account has been successfully verified! You can now log in.",
    });
  });
}
