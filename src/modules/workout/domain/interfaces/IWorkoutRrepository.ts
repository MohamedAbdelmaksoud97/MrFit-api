// src/modules/workout/domain/interfaces/IWorkoutRepository.ts
import { WorkoutPlan } from "../entities/WorkoutPlan";

export interface IWorkoutRepository {
  save(plan: WorkoutPlan): Promise<void>;
  findById(id: string): Promise<WorkoutPlan | null>;
  getActivePlanByUserId(userId: string): Promise<WorkoutPlan | null>;
  archiveAllActivePlans(userId: string): Promise<void>;
}
