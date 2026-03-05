// src/modules/workout/infrastructure/controllers/WorkoutController.ts
import { Request, Response } from "express";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { GenerateWorkoutPlan } from "../../workout/application/use-cases/GenerateWorkoutPlan";
import { AppError } from "../../../shared/domain/errors/AppError";
import { IWorkoutRepository } from "../../workout/domain/interfaces/IWorkoutRrepository";

export class WorkoutController {
  constructor(
    private generateUseCase: GenerateWorkoutPlan,
    private IWorkoutRepository: IWorkoutRepository,
  ) {}

  generate = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    await this.IWorkoutRepository.archiveAllActivePlans(userId);
    const plan = await this.generateUseCase.execute(userId);

    if (!plan) {
      throw new AppError("Failed to generate workout plan");
    }

    res.status(201).json({
      status: "success",
      message: "AI has tailored your workout split!",
      data: { plan },
    });
  });
}
