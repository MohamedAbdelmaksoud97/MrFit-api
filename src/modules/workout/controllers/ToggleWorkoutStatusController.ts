// src/modules/workout/infrastructure/controllers/WorkoutController.ts
import { Request, Response, NextFunction } from "express";
import { ToggleWorkoutStatus } from "../application/use-cases/ToggleWorkoutStatus";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";

export class ToggleWorkoutStatusController {
  constructor(private toggleStatusUseCase: ToggleWorkoutStatus) {}

  // تغليف الميثود بالكامل بـ catchAsync
  toggleExercise = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;
    const { dayNumber, exerciseName } = req.body;

    if (!dayNumber || !exerciseName) {
      // الـ catchAsync هيلقط الخطأ ده ويبعته للـ next(error)
      throw new Error("Missing dayNumber or exerciseName in request body.");
    }

    await this.toggleStatusUseCase.execute({
      userId,
      dayNumber: Number(dayNumber),
      exerciseName,
    });

    res.status(200).json({
      status: "success",
      message: `Successfully toggled status for ${exerciseName}.`,
    });
  });
}
