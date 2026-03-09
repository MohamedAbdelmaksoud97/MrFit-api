// src/modules/workout/application/use-cases/ToggleWorkoutStatus.ts
import { IWorkoutRepository } from "../../domain/interfaces/IWorkoutRrepository";
import { AppError } from "../../../../shared/domain/errors/AppError";

export interface ToggleWorkoutDTO {
  userId: string;
  dayNumber: number;
  exerciseName: string;
}

export class ToggleWorkoutStatus {
  constructor(private workoutRepository: IWorkoutRepository) {}

  async execute(dto: ToggleWorkoutDTO): Promise<void> {
    // 1. Retrieve the active plan from MongoDB Atlas
    const plan = await this.workoutRepository.getActivePlanByUserId(dto.userId);

    if (!plan) {
      throw new AppError("You don't have an active workout plan to update.", 404);
    }

    // 2. Apply the Domain Logic
    try {
      plan.toggleExercise(dto.dayNumber, dto.exerciseName);
    } catch (error: any) {
      throw new AppError(error.message, 400);
    }

    // 3. Persist the updated Entity back to the database
    // This will trigger an 'update' because we use the same UUID as _id
    await this.workoutRepository.save(plan);
  }
}
