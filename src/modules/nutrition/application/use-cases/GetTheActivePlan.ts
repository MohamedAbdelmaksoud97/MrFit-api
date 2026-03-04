import { INutritionRepository } from "../../domain/interfaces/INutritionRepository";
import { IUserRepository } from "../../../user/domain/interfaces/IUserRepository";
import { NutritionPlan } from "../../domain/entities/NutritionPlan";
export class GetTheActivePlan {
  constructor(
    private nutritionRepository: INutritionRepository,
    private userRepository: IUserRepository,
  ) {}

  execute(userId: string): Promise<NutritionPlan | null> {
    return this.nutritionRepository.getActivePlanByUserId(userId);
  }
}
