import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { UpdateProfile } from "../application/use-cases/UpdateProfile";
import { Request, Response, NextFunction } from "express";

export class UpdateProfileController {
  constructor(private updateProfileUseCase: UpdateProfile) {}
  excute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // تأكد من أن المستخدم موجود في الطلب
    const fieldsToUpdate = req.body; // الحقول التي سيتم تحديثها
    console.log(fieldsToUpdate, "==============================");
    await this.updateProfileUseCase.execute(user, fieldsToUpdate);
    res.status(200).json({ message: "Profile updated successfully" });
  });
}
