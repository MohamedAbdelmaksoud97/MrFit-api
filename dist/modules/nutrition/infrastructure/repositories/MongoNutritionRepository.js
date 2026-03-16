"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoNutritionRepository = void 0;
const NutritionPlan_1 = require("../../domain/entities/NutritionPlan");
const NutritionPlaneModel_1 = require("../models/NutritionPlaneModel");
class MongoNutritionRepository {
    async save(plan) {
        // We map the Entity to the Database Schema structure
        // Note: We use _id to store your UUID string
        const persistenceData = {
            _id: plan.getId(),
            userId: plan.getUserId(),
            days: plan.getDays(),
            // Accessing private fields for persistence
            dailyTargetMacros: plan.dailyTargetMacros,
            goalSnapshot: plan.goalSnapshot,
            status: plan.status || "active",
        };
        await NutritionPlaneModel_1.NutritionModel.findOneAndUpdate({ _id: plan.getId() }, { $set: persistenceData }, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await NutritionPlaneModel_1.NutritionModel.findOne({ _id: id }).lean();
        if (!doc)
            return null;
        return this.mapToEntity(doc);
    }
    async findByUserId(userId) {
        const docs = await NutritionPlaneModel_1.NutritionModel.find({ userId }).lean();
        return docs.map((doc) => this.mapToEntity(doc));
    }
    async getActivePlanByUserId(userId) {
        const doc = await NutritionPlaneModel_1.NutritionModel.findOne({ userId, status: "active" }).lean();
        if (!doc)
            return null;
        return this.mapToEntity(doc);
    }
    async archiveAllActivePlans(userId) {
        await NutritionPlaneModel_1.NutritionModel.updateMany({ userId, status: "active" }, { $set: { status: "archived" } });
    }
    /**
     * Internal Mapper: Rehydrates the raw DB document back into
     * a rich NutritionPlan Entity with its business logic methods.
     */
    mapToEntity(doc) {
        return new NutritionPlan_1.NutritionPlan({
            userId: doc.userId,
            goalSnapshot: doc.goalSnapshot,
            days: doc.days,
            dailyTargetMacros: doc.dailyTargetMacros,
            status: doc.status,
        }, doc._id);
    }
}
exports.MongoNutritionRepository = MongoNutritionRepository;
