import { Request, Response, NextFunction } from "express";
import { CreateNewPassword } from "../application/use-cases/CreateNewPassword";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { AppError } from "../../../shared/domain/errors/AppError";

export class CreateNewPasswordController {
  constructor(private createNewPasswordUseCase: CreateNewPassword) {}

  createNewPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { newPassword, newPasswordConfirmation } = req.body;

    // Type guard for the token
    if (!token || typeof token !== "string") {
      throw new AppError("A valid reset token is required.", 400);
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
