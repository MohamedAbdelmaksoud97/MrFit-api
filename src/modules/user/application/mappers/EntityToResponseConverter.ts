import { User as UserEntity } from "../../domain/entities/User";
import { ResponsingUser } from "../dtos/UserDTOs";

export class EntityToResponseConverter {
  // يحول الـ Entity لـ DTO عشان نرجعه للـ Client
  static toDTO(user: UserEntity): ResponsingUser {
    return {
      id: user.getId(),
      username: user.getName(),
      email: user.getEmail(),
      profile: {
        age: user.getProfile().age,
        goal: user.getProfile().goal,
        height: user.getProfile().height,
        weight: user.getProfile().weight,
        fitnessLevel: user.getProfile().fitnessLevel,
        budgetLevel: user.getProfile().budgetLevel || "Average",

        // هنا الـ Mapper عمل "بزنس" بسيط: حسب الـ BMI للموبايل
        bmi: Number((user.getProfile().weight / (user.getProfile().height / 100) ** 2).toFixed(1)),
      },
    };
  }
}
