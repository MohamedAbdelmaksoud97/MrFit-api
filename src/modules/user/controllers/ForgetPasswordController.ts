import { Request, Response, NextFunction } from "express";
import { ForgetPassword } from "../application/use-cases/ForgetPassword";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";

export class ForgetPasswordController {
  constructor(private forgetPasswordUseCase: ForgetPassword) {}

  // Use Arrow Function + catchAsync
  forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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
