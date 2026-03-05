// src/modules/workout/infrastructure/services/FakeWorkoutAiGenerator.ts
import { IWorkoutAiGenerator } from "../../domain/interfaces/IWorkoutAiGenerator";
import { User } from "../../../user/domain/entities/User";

export class FakeWorkoutAiGenerator implements IWorkoutAiGenerator {
  async generatePlan(user: User): Promise<any> {
    console.log(`[FakeWorkoutAI] Creating split for ${user.getProfile().goal} ...`);

    return {
      splitType: "Push/Pull/Legs",
      days: [
        {
          dayNumber: 1,
          dayName: "Saturday",
          isRestDay: false,
          workoutTitle: "Push Day",
          exercises: [
            {
              name: "Dumbbell Press",
              muscleGroup: "Chest",
              sets: 3,
              reps: "12",
              restSeconds: 60,
              notes: "Focus on the stretch",
            },
          ],
        },
        {
          dayNumber: 2,
          dayName: "Sunday",
          isRestDay: true,
          exercises: [],
        },
      ],
    };
  }
}
