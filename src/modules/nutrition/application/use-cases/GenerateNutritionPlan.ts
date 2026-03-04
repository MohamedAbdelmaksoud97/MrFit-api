// src/modules/nutrition/application/use-cases/GenerateNutritionPlan.ts
import { IAiGenerator } from "../../domain/interfaces/IAiGenerator";
import { INutritionRepository } from "../../domain/interfaces/INutritionRepository";
import { IUserRepository } from "../../../user/domain/interfaces/IUserRepository";
import { NutritionPlan } from "../../domain/entities/NutritionPlan";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class GenerateNutritionPlan {
  constructor(
    private aiGenerator: IAiGenerator,
    private nutritionRepository: INutritionRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<NutritionPlan> {
    // 1. Get User Profile (to give context to AI)
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    // 2. Generate via AI
    const rawAiData = await this.aiGenerator.execute(user);

    // 3. Transform AI raw data into Domain Entity
    const plan = new NutritionPlan({
      userId: user.getId(),
      goalSnapshot: user.getProfile().goal,
      dailyTargetMacros: rawAiData.dailyTargetMacros,
      days: rawAiData.days,
    });

    // 4. Persistence
    await this.nutritionRepository.save(plan);

    return plan;
  }
}
