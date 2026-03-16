"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeNutritionRepository = void 0;
class FakeNutritionRepository {
    plans = new Map();
    async save(plan) {
        this.plans.set(plan.getId(), plan);
        console.log(`[FakeRepo] Saved plan ${plan.getId()} for user ${plan.getUserId()}`);
    }
    async findByUserId(userId) {
        return Array.from(this.plans.values()).filter((p) => p.getUserId() === userId);
    }
    async archiveAllActivePlans(userId) {
        console.log(`[FakeRepo] Archiving old plans for user ${userId}`);
    }
    async findById(id) {
        return this.plans.get(id) || null;
    }
    async getActivePlanByUserId(userId) {
        return Array.from(this.plans.values()).find((p) => p.getUserId() === userId) || null;
    }
}
exports.FakeNutritionRepository = FakeNutritionRepository;
