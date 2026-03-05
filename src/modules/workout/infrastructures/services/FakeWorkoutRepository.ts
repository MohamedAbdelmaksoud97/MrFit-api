// src/modules/workout/infrastructure/repositories/FakeWorkoutRepository.ts
import { IWorkoutRepository } from "../../domain/interfaces/IWorkoutRrepository";
import { WorkoutPlan } from "../../domain/entities/WorkoutPlan";

export class FakeWorkoutRepository implements IWorkoutRepository {
  // تخزين الخطط في Map (الـ Key هو الـ ID والـ Value هو الـ Entity)
  private plans: Map<string, WorkoutPlan> = new Map();

  async save(plan: WorkoutPlan): Promise<void> {
    this.plans.set(plan.getId(), plan);
    console.log(`[FakeWorkoutRepo] Saved plan ID: ${plan.getId()} for User: ${plan.getUserId()}`);
  }

  async findById(id: string): Promise<WorkoutPlan | null> {
    const plan = this.plans.get(id);
    return plan || null;
  }

  async getActivePlanByUserId(userId: string): Promise<WorkoutPlan | null> {
    // بندور على أول خطة تخص اليوزر ويكون حالتها active
    const activePlan = Array.from(this.plans.values()).find(
      (plan) => plan.getUserId() === userId && (plan as any).status === "active",
    );

    return activePlan || null;
  }

  async archiveAllActivePlans(userId: string): Promise<void> {
    // بنجيب كل خطط اليوزر اللي حالتها active ونحولها لـ archived
    const userPlans = Array.from(this.plans.values()).filter(
      (plan) => plan.getUserId() === userId && (plan as any).status === "active",
    );

    userPlans.forEach((plan) => {
      plan.archive(); // بننادي الميثود اللي عملناها في الـ Entity
    });

    if (userPlans.length > 0) {
      console.log(
        `[FakeWorkoutRepo] Archived ${userPlans.length} previous plans for user ${userId}`,
      );
    }
  }

  // ميثود إضافية للتأكد من الداتا (Debug)
  async getAllPlans(): Promise<WorkoutPlan[]> {
    return Array.from(this.plans.values());
  }
}

// تصدير نسخة واحدة مشتركة (Singleton Instance)
export const sharedWorkoutRepository = new FakeWorkoutRepository();
