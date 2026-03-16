"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateWorkoutPlan = void 0;
const WorkoutPlan_1 = require("../../domain/entities/WorkoutPlan");
class GenerateWorkoutPlan {
    workoutRepo;
    userRepo;
    aiGenerator;
    constructor(workoutRepo, userRepo, aiGenerator) {
        this.workoutRepo = workoutRepo;
        this.userRepo = userRepo;
        this.aiGenerator = aiGenerator;
    }
    async execute(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user)
            throw new Error("User not found");
        // أرشفة الخطط القديمة
        await this.workoutRepo.archiveAllActivePlans(userId);
        // توليد الخطة بالذكاء الاصطناعي
        const aiData = await this.aiGenerator.generatePlan(user);
        const newPlan = new WorkoutPlan_1.WorkoutPlan({
            userId: user.getId(),
            fitnessLevelSnapshot: user.getProfile().fitnessLevel,
            goalSnapshot: user.getProfile().goal,
            splitType: aiData.splitType,
            days: aiData.days,
        });
        await this.workoutRepo.save(newPlan);
        return newPlan;
    }
}
exports.GenerateWorkoutPlan = GenerateWorkoutPlan;
