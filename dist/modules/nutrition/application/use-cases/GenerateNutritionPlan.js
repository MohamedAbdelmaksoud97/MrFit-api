"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateNutritionPlan = void 0;
const NutritionPlan_1 = require("../../domain/entities/NutritionPlan");
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class GenerateNutritionPlan {
    aiGenerator;
    nutritionRepository;
    userRepository;
    constructor(aiGenerator, nutritionRepository, userRepository) {
        this.aiGenerator = aiGenerator;
        this.nutritionRepository = nutritionRepository;
        this.userRepository = userRepository;
    }
    async execute(userId) {
        // 1. Get User Profile (to give context to AI)
        const user = await this.userRepository.findById(userId);
        if (!user)
            throw new AppError_1.AppError("User not found", 404);
        // 2. Generate via AI
        const rawAiData = await this.aiGenerator.execute(user);
        // 3. Transform AI raw data into Domain Entity
        const plan = new NutritionPlan_1.NutritionPlan({
            userId: user.getId(),
            goalSnapshot: user.getProfile().goal,
            dailyTargetMacros: rawAiData.dailyTargetMacros,
            days: rawAiData.days,
        });
        // 4. Persistence
        await this.nutritionRepository.save(plan);
        return plan;
    }
}
exports.GenerateNutritionPlan = GenerateNutritionPlan;
