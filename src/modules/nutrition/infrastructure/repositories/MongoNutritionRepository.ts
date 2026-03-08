// src/modules/nutrition/infrastructure/repositories/MongoNutritionRepository.ts
import { INutritionRepository } from "../../domain/interfaces/INutritionRepository";
import { NutritionPlan } from "../../domain/entities/NutritionPlan";
import { NutritionModel } from "../models/NutritionPlaneModel";

export class MongoNutritionRepository implements INutritionRepository {
  async save(plan: NutritionPlan): Promise<void> {
    // We map the Entity to the Database Schema structure
    // Note: We use _id to store your UUID string
    const persistenceData = {
      _id: plan.getId(),
      userId: plan.getUserId(),
      days: plan.getDays(),
      // Accessing private fields for persistence
      dailyTargetMacros: (plan as any).dailyTargetMacros,
      goalSnapshot: (plan as any).goalSnapshot,
      status: (plan as any).status || "active",
    };

    await NutritionModel.findOneAndUpdate(
      { _id: plan.getId() },
      { $set: persistenceData },
      { upsert: true, new: true },
    );
  }

  async findById(id: string): Promise<NutritionPlan | null> {
    const doc = await NutritionModel.findOne({ _id: id }).lean();
    if (!doc) return null;

    return this.mapToEntity(doc);
  }

  async findByUserId(userId: string): Promise<NutritionPlan[]> {
    const docs = await NutritionModel.find({ userId }).lean();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async getActivePlanByUserId(userId: string): Promise<NutritionPlan | null> {
    const doc = await NutritionModel.findOne({ userId, status: "active" }).lean();
    if (!doc) return null;

    return this.mapToEntity(doc);
  }

  async archiveAllActivePlans(userId: string): Promise<void> {
    await NutritionModel.updateMany({ userId, status: "active" }, { $set: { status: "archived" } });
  }

  /**
   * Internal Mapper: Rehydrates the raw DB document back into
   * a rich NutritionPlan Entity with its business logic methods.
   */
  private mapToEntity(doc: any): NutritionPlan {
    return new NutritionPlan(
      {
        userId: doc.userId,
        goalSnapshot: doc.goalSnapshot,
        days: doc.days,
        dailyTargetMacros: doc.dailyTargetMacros,
        status: doc.status,
      },
      doc._id, // Pass the UUID back as the ID
    );
  }
}
