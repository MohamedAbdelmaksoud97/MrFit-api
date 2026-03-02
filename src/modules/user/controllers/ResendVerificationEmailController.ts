import { Request, Response, NextFunction } from "express";
import { ResendVerificationEmail } from "../application/use-cases/ResendVerificationEmail";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { AppError } from "../../../shared/domain/errors/AppError";

export class ResendVerificationEmailController {
  constructor(private resendVerificationEmailUseCase: ResendVerificationEmail) {}

  // Wrap with catchAsync to delegate error handling to GlobalErrorHandler
  resendToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email address is required.", 400);
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
