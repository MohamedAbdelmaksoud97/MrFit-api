// src/modules/workout/infrastructure/repositories/MongoWorkoutRepository.ts
import { IWorkoutRepository } from "../../domain/interfaces/IWorkoutRrepository";
import { WorkoutPlan } from "../../domain/entities/WorkoutPlan";
import { WorkoutModel } from "../models/WorkoutPlanModel";

export class MongoWorkoutRepository implements IWorkoutRepository {
  // src/modules/workout/infrastructure/repositories/MongoWorkoutRepository.ts

  async save(plan: WorkoutPlan): Promise<void> {
    const persistenceData = {
      _id: plan.getId(),
      userId: plan.getUserId(),
      fitnessLevelSnapshot: (plan as any).fitnessLevelSnapshot,
      goalSnapshot: (plan as any).goalSnapshot,
      splitType: (plan as any).splitType,
      status: (plan as any).status || "active",
      // Explicitly map the days and exercises to plain objects
      days: plan.getDays().map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => ({
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          sets: ex.sets,
          reps: ex.reps,
          isCompleted: ex.isCompleted ?? false, // Ensure it's never undefined
          restSeconds: ex.restSeconds,
          notes: ex.notes,
        })),
      })),
    };

    await WorkoutModel.findOneAndUpdate(
      { _id: plan.getId() },
      { $set: persistenceData },
      { upsert: true, new: true },
    );
  }

  async findById(id: string): Promise<WorkoutPlan | null> {
    const doc = await WorkoutModel.findById(id).lean();
    if (!doc) return null;

    return this.mapToEntity(doc);
  }

  async getActivePlanByUserId(userId: string): Promise<WorkoutPlan | null> {
    const doc = await WorkoutModel.findOne({ userId, status: "active" }).lean();
    if (!doc) return null;

    return this.mapToEntity(doc);
  }

  async archiveAllActivePlans(userId: string): Promise<void> {
    await WorkoutModel.updateMany({ userId, status: "active" }, { $set: { status: "archived" } });
    console.log(`[Mongo] Archived old workouts for user: ${userId}`);
  }

  /**
   * Internal Mapper: Rehydrates the raw DB document back into
   * a rich WorkoutPlan Entity with its domain methods.
   */
  private mapToEntity(doc: any): WorkoutPlan {
    return new WorkoutPlan(
      {
        userId: doc.userId,
        fitnessLevelSnapshot: doc.fitnessLevelSnapshot,
        goalSnapshot: doc.goalSnapshot,
        splitType: doc.splitType,
        days: doc.days,
        status: doc.status,
      },
      doc._id, // Pass the UUID back as the ID
    );
  }
}
