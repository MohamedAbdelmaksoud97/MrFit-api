import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { EntityToResponseConverter } from "../application/mappers/EntityToResponseConverter";
import { AppError } from "../../../shared/domain/errors/AppError";

export class ProfileController {
  getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userEntity = (req as any).user;

    if (!userEntity) {
      throw new AppError("User not found in request context", 404);
    }

    const userDTO = EntityToResponseConverter.toDTO(userEntity);

    return res.status(200).json({
      success: true,
      data: userDTO,
    });
  });
}
