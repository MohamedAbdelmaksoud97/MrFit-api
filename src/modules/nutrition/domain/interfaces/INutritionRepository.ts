// src/modules/nutrition/domain/interfaces/INutritionRepository.ts
import { NutritionPlan } from "../entities/NutritionPlan";

export interface INutritionRepository {
  save(plan: NutritionPlan): Promise<void>;
  findById(id: string): Promise<NutritionPlan | null>;
  findByUserId(userId: string): Promise<NutritionPlan[]>;
  getActivePlanByUserId(userId: string): Promise<NutritionPlan | null>;
  archiveAllActivePlans(userId: string): Promise<void>;
}
