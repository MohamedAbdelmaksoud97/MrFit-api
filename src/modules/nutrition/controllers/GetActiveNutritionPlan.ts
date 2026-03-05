import { NextFunction, Request, Response } from "express";

import { AppError } from "../../../shared/domain/errors/AppError";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { GetTheActivePlan } from "../application/use-cases/GetTheActivePlan";
export class GetActiveNutritionPlan {
  constructor(private getTheActivePlanUseCase: GetTheActivePlan) {}
  execute = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Assuming 'req.user' is populated by your Auth middleware
    const userId = (req as any).user.id;

    const plan = await this.getTheActivePlanUseCase.execute(userId);
    if (!plan) {
      res.status(404).json({
        status: "fail",
        message: "No active nutrition plan found for this user.",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: { plan },
    });
  });
}
