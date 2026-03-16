"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleWorkoutStatus = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class ToggleWorkoutStatus {
    workoutRepository;
    constructor(workoutRepository) {
        this.workoutRepository = workoutRepository;
    }
    async execute(dto) {
        // 1. Retrieve the active plan from MongoDB Atlas
        const plan = await this.workoutRepository.getActivePlanByUserId(dto.userId);
        if (!plan) {
            throw new AppError_1.AppError("You don't have an active workout plan to update.", 404);
        }
        // 2. Apply the Domain Logic
        try {
            plan.toggleExercise(dto.dayNumber, dto.exerciseName);
        }
        catch (error) {
            throw new AppError_1.AppError(error.message, 400);
        }
        // 3. Persist the updated Entity back to the database
        // This will trigger an 'update' because we use the same UUID as _id
        await this.workoutRepository.save(plan);
    }
}
exports.ToggleWorkoutStatus = ToggleWorkoutStatus;
