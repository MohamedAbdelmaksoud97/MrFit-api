// src/modules/workout/application/use-cases/GetActiveWorkoutPlan.ts
import { IWorkoutRepository } from "../../domain/interfaces/IWorkoutRrepository";
import { WorkoutPlan } from "../../domain/entities/WorkoutPlan";

export class GetActiveWorkoutPlan {
  constructor(private workoutRepository: IWorkoutRepository) {}

  async execute(userId: string): Promise<WorkoutPlan | null> {
    // بنسأل الريبوزيتوري عن الخطة اللي الـ status بتاعها active لليوزر ده
    const plan = await this.workoutRepository.getActivePlanByUserId(userId);
    return plan;
  }
}
