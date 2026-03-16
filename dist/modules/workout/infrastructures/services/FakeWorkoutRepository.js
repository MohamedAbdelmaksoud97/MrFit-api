"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedWorkoutRepository = exports.FakeWorkoutRepository = void 0;
class FakeWorkoutRepository {
    // تخزين الخطط في Map (الـ Key هو الـ ID والـ Value هو الـ Entity)
    plans = new Map();
    async save(plan) {
        this.plans.set(plan.getId(), plan);
        console.log(`[FakeWorkoutRepo] Saved plan ID: ${plan.getId()} for User: ${plan.getUserId()}`);
    }
    async findById(id) {
        const plan = this.plans.get(id);
        return plan || null;
    }
    async getActivePlanByUserId(userId) {
        // بندور على أول خطة تخص اليوزر ويكون حالتها active
        const activePlan = Array.from(this.plans.values()).find((plan) => plan.getUserId() === userId && plan.status === "active");
        return activePlan || null;
    }
    async archiveAllActivePlans(userId) {
        // بنجيب كل خطط اليوزر اللي حالتها active ونحولها لـ archived
        const userPlans = Array.from(this.plans.values()).filter((plan) => plan.getUserId() === userId && plan.status === "active");
        userPlans.forEach((plan) => {
            plan.archive(); // بننادي الميثود اللي عملناها في الـ Entity
        });
        if (userPlans.length > 0) {
            console.log(`[FakeWorkoutRepo] Archived ${userPlans.length} previous plans for user ${userId}`);
        }
    }
    // ميثود إضافية للتأكد من الداتا (Debug)
    async getAllPlans() {
        return Array.from(this.plans.values());
    }
}
exports.FakeWorkoutRepository = FakeWorkoutRepository;
// تصدير نسخة واحدة مشتركة (Singleton Instance)
exports.sharedWorkoutRepository = new FakeWorkoutRepository();
