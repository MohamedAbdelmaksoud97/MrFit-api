// src/modules/nutrition/infrastructure/repositories/FakeNutritionRepository.ts
import { INutritionRepository } from "../../domain/interfaces/INutritionRepository";
import { NutritionPlan } from "../../domain/entities/NutritionPlan";

export class FakeNutritionRepository implements INutritionRepository {
  private plans: Map<string, NutritionPlan> = new Map();

  async save(plan: NutritionPlan): Promise<void> {
    this.plans.set(plan.getId(), plan);
    console.log(`[FakeRepo] Saved plan ${plan.getId()} for user ${plan.getUserId()}`);
  }

  async findByUserId(userId: string): Promise<NutritionPlan[]> {
    return Array.from(this.plans.values()).filter((p) => p.getUserId() === userId);
  }

  async archiveAllActivePlans(userId: string): Promise<void> {
    console.log(`[FakeRepo] Archiving old plans for user ${userId}`);
  }

  async findById(id: string): Promise<NutritionPlan | null> {
    return this.plans.get(id) || null;
  }

  async getActivePlanByUserId(userId: string): Promise<NutritionPlan | null> {
    return Array.from(this.plans.values()).find((p) => p.getUserId() === userId) || null;
  }
}
