import { Request, Response, NextFunction } from "express";
import { UpdatePassword } from "../application/use-cases/UpdatePassword";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { AppError } from "../../../shared/domain/errors/AppError";

export class UpdatePasswordController {
  constructor(private updatePasswordUseCase: UpdatePassword) {}

  updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      throw new AppError("Authentication required to update password.", 401);
    }

    const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

    await this.updatePasswordUseCase.execute(
      user,
      currentPassword,
      newPassword,
      newPasswordConfirmation,
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  });
}
