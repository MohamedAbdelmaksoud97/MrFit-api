// src/modules/nutrition/application/use-cases/ToggleMealStatus.ts
import { INutritionRepository } from "../../domain/interfaces/INutritionRepository";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class ToggleMealStatus {
  constructor(private nutritionRepository: INutritionRepository) {}

  async execute(userId: string, dayNumber: number, mealName: string) {
    // 1. هات الخطة النشطة لليوزر ده
    const plan = await this.nutritionRepository.getActivePlanByUserId(userId);
    if (!plan) {
      throw new AppError("No active nutrition plan found to update.", 404);
    }

    // 2. نفذ التغيير جوه الـ Entity
    try {
      plan.toggleMeal(dayNumber, mealName);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }

    // 3. احفظ الـ Entity بعد التعديل
    await this.nutritionRepository.save(plan);

    return plan;
  }
}
