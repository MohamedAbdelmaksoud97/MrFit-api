// src/modules/nutrition/infrastructure/controllers/ToggleMealController.ts
import { Request, Response } from "express";
import { ToggleMealStatus } from "../application/use-cases/ToggleMealStatus";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { AppError } from "../../../shared/domain/errors/AppError";

export class ToggleMealController {
  constructor(private toggleMealStatusUseCase: ToggleMealStatus) {}

  execute = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { dayNumber, mealName } = req.body;

    if (!dayNumber || !mealName) {
      throw new AppError("Please provide dayNumber and mealName", 400);
    }

    const updatedPlan = await this.toggleMealStatusUseCase.execute(userId, dayNumber, mealName);

    res.status(200).json({
      status: "success",
      message: "Meal status updated successfully",
      data: { plan: updatedPlan },
    });
  });
}
