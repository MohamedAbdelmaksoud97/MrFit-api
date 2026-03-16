"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoWorkoutRepository = void 0;
const WorkoutPlan_1 = require("../../domain/entities/WorkoutPlan");
const WorkoutPlanModel_1 = require("../models/WorkoutPlanModel");
class MongoWorkoutRepository {
    // src/modules/workout/infrastructure/repositories/MongoWorkoutRepository.ts
    async save(plan) {
        const persistenceData = {
            _id: plan.getId(),
            userId: plan.getUserId(),
            fitnessLevelSnapshot: plan.fitnessLevelSnapshot,
            goalSnapshot: plan.goalSnapshot,
            splitType: plan.splitType,
            status: plan.status || "active",
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
        await WorkoutPlanModel_1.WorkoutModel.findOneAndUpdate({ _id: plan.getId() }, { $set: persistenceData }, { upsert: true, new: true });
    }
    async findById(id) {
        const doc = await WorkoutPlanModel_1.WorkoutModel.findById(id).lean();
        if (!doc)
            return null;
        return this.mapToEntity(doc);
    }
    async getActivePlanByUserId(userId) {
        const doc = await WorkoutPlanModel_1.WorkoutModel.findOne({ userId, status: "active" }).lean();
        if (!doc)
            return null;
        return this.mapToEntity(doc);
    }
    async archiveAllActivePlans(userId) {
        await WorkoutPlanModel_1.WorkoutModel.updateMany({ userId, status: "active" }, { $set: { status: "archived" } });
        console.log(`[Mongo] Archived old workouts for user: ${userId}`);
    }
    /**
     * Internal Mapper: Rehydrates the raw DB document back into
     * a rich WorkoutPlan Entity with its domain methods.
     */
    mapToEntity(doc) {
        return new WorkoutPlan_1.WorkoutPlan({
            userId: doc.userId,
            fitnessLevelSnapshot: doc.fitnessLevelSnapshot,
            goalSnapshot: doc.goalSnapshot,
            splitType: doc.splitType,
            days: doc.days,
            status: doc.status,
        }, doc._id);
    }
}
exports.MongoWorkoutRepository = MongoWorkoutRepository;
