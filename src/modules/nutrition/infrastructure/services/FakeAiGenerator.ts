// src/modules/nutrition/infrastructure/services/FakeAiGenerator.ts
import { IAiGenerator } from "../../domain/interfaces/IAiGenerator";
import { User } from "../../../user/domain/entities/User";

export class FakeAiGenerator implements IAiGenerator {
  async execute(user: User): Promise<any> {
    console.log(`[FakeAI] Generating plan for user: ${user.getName()}...`);

    // Simulating a slight delay like a real AI
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      dailyTargetMacros: { calories: 2400, protein: 180, carbs: 220, fats: 70 },
      days: [
        {
          dayNumber: 1,
          dayName: "Monday",
          meals: [
            {
              mealType: "Breakfast",
              name: "Oatmeal with Protein Powder",
              ingredients: [
                { item: "Oats", amount: "100g" },
                { item: "Whey", amount: "1 scoop" },
              ],
              macros: { calories: 400, protein: 35, carbs: 50, fats: 8 },
              isEconomic: true,
            },
          ],
        },
      ],
      totalWeeklyBudgetEstimate: 500,
    };
  }
}
