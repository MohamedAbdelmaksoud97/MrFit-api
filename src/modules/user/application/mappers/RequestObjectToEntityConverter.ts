import { User, UserProfile } from "../../domain/entities/User";
import { RegisteringUser } from "../dtos/UserDTOs";

export class RequestObjectToEntityConverter {
  /**
   * يحول بيانات التسجيل (DTO) إلى كائن اليوزر (Entity)
   * هذا هو الـ Inbound Mapping
   */
  static toEntity(dto: RegisteringUser, passwordHash: string): User {
    // 1. أولاً بنبني الـ Profile (الـ Value Object) من بيانات الريكويست
    const userProfile = new UserProfile(
      dto.profile.age,
      dto.profile.height,
      dto.profile.gender,
      dto.profile.fitnessLevel,
      dto.profile.weight,

      dto.profile.goal,
      undefined, // fatPercentage (لو لسه معندناش قيمته في التسجيل)
      dto.profile.budgetLevel,
    );

    // 2. بنرجع الـ Entity كامل وجاهز للبزنس
    return new User(
      //
      dto.username,

      dto.email,
      passwordHash, // بنمرر الهاش اللي اتعمل في الـ Use Case
      userProfile,
    );
  }
}
