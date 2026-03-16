"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveWorkoutPlan = void 0;
class GetActiveWorkoutPlan {
    workoutRepository;
    constructor(workoutRepository) {
        this.workoutRepository = workoutRepository;
    }
    async execute(userId) {
        // بنسأل الريبوزيتوري عن الخطة اللي الـ status بتاعها active لليوزر ده
        const plan = await this.workoutRepository.getActivePlanByUserId(userId);
        return plan;
    }
}
exports.GetActiveWorkoutPlan = GetActiveWorkoutPlan;
