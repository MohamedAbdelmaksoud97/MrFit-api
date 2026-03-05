// src/modules/workout/domain/interfaces/IWorkoutAiGenerator.ts
import { User } from "../../../user/domain/entities/User";

export interface IWorkoutAiGenerator {
  generatePlan(user: User): Promise<any>;
}
