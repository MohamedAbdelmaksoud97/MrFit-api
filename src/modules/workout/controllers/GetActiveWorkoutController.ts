// src/modules/workout/infrastructure/controllers/GetActiveWorkoutController.ts
import { Request, Response } from "express";
import { GetActiveWorkoutPlan } from "../../workout/application/use-cases/GetActiveWorkoutPlan";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";

export class GetActiveWorkoutController {
  constructor(private getActiveWorkoutUseCase: GetActiveWorkoutPlan) {}

  execute = catchAsync(async (req: Request, res: Response) => {
    // اليوزر آي دي جاي من الـ Protect Middleware
    const userId = (req as any).user.id;

    const plan = await this.getActiveWorkoutUseCase.execute(userId);

    if (!plan) {
      return res.status(200).json({
        status: "success",
        message: "No active workout plan found. Time to generate one!",
        data: null,
      });
    }

    res.status(200).json({
      status: "success",
      data: { plan },
    });
  });
}
