import { IWorkoutRepository } from "../../domain/interfaces/IWorkoutRrepository";
import { IUserRepository } from "../../../user/domain/interfaces/IUserRepository";

import { IWorkoutAiGenerator } from "../../domain/interfaces/IWorkoutAiGenerator";
import { WorkoutPlan } from "../../domain/entities/WorkoutPlan";
export class GenerateWorkoutPlan {
  constructor(
    private workoutRepo: IWorkoutRepository,
    private userRepo: IUserRepository,
    private aiGenerator: IWorkoutAiGenerator,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    // أرشفة الخطط القديمة
    await this.workoutRepo.archiveAllActivePlans(userId);

    // توليد الخطة بالذكاء الاصطناعي
    const aiData = await this.aiGenerator.generatePlan(user);

    const newPlan = new WorkoutPlan({
      userId: user.getId(),
      fitnessLevelSnapshot: user.getProfile().fitnessLevel,
      goalSnapshot: user.getProfile().goal,
      splitType: aiData.splitType,
      days: aiData.days,
    });

    await this.workoutRepo.save(newPlan);
    return newPlan;
  }
}
