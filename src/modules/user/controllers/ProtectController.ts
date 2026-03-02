import { Request, Response, NextFunction } from "express";
import { Protect } from "../application/use-cases/Protect";
import { ExtractToken } from "../infrastructure/services/ExtractToken";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { AppError } from "../../../shared/domain/errors/AppError";

export class ProtectController {
  constructor(private protect: Protect) {}

  execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = ExtractToken.fromHeaderOrCookie(req);

    if (!token) {
      throw new AppError("You are not logged in! Please provide a token.", 401);
    }

    const user = await this.protect.validateAndGetUser(token);

    (req as any).user = user;

    next();
  });
}
