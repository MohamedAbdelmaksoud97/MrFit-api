// src/modules/nutrition/infrastructure/controllers/NutritionController.ts
import { Request, Response } from "express";
import { GenerateNutritionPlan } from "../application/use-cases/GenerateNutritionPlan";
import { catchAsync } from "../../../shared/domain/errors/CatchAsync";
import { AppError } from "../../../shared/domain/errors/AppError";
import { INutritionRepository } from "../domain/interfaces/INutritionRepository";

export class NutritionController {
  constructor(
    private generatePlanUseCase: GenerateNutritionPlan,
    private nutritionRepository: INutritionRepository,
  ) {}

  // POST /api/v1/nutrition/generate
  generate = catchAsync(async (req: Request, res: Response) => {
    // Assuming 'req.user' is populated by your Auth middleware
    const userId = (req as any).user.id;

    await this.nutritionRepository.archiveAllActivePlans(userId);

    const plan = await this.generatePlanUseCase.execute(userId);

    if (!plan) {
      throw new AppError("Failed to generate nutrition plan , please try again .");
    }

    res.status(201).json({
      status: "success",
      data: { plan },
    });
  });
}
