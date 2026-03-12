import { IUserRepository } from "../../domain/interfaces/IUserRepository";

import { User } from "../../domain/entities/User";
import { UserProfile } from "../../domain/entities/User";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class UpdateProfile {
  constructor(private userRepo: IUserRepository) {}
  async execute(
    user: User,
    fieldsToUpdate: {
      height?: number;
      fitnessLevel?: "Beginner" | "Intermediate" | "Advanced";
      goal?: "Losing Weight" | "Building Muscle" | "Maintenance";
      budgetLevel?: "Economic" | "Average" | "High";
      weight?: number;
    },
  ): Promise<void> {
    const userToUpdate = await this.userRepo.findById(user.getId());
    if (!userToUpdate) {
      throw new AppError("User not found", 404);
    }
    const currentProfile = userToUpdate.getProfile();
    const updatedProfile = new UserProfile(
      currentProfile.age,
      fieldsToUpdate.height || currentProfile.height,
      currentProfile.gender,
      fieldsToUpdate.fitnessLevel || currentProfile.fitnessLevel,
      fieldsToUpdate.weight || currentProfile.weight,
      fieldsToUpdate.goal || currentProfile.goal,
      currentProfile.fatPercentage,
      fieldsToUpdate.budgetLevel || currentProfile.budgetLevel,
    );
    userToUpdate.setProfile(updatedProfile);
    await this.userRepo.save(userToUpdate);
  }
}
