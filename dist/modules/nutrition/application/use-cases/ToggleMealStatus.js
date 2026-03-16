"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleMealStatus = void 0;
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class ToggleMealStatus {
    nutritionRepository;
    constructor(nutritionRepository) {
        this.nutritionRepository = nutritionRepository;
    }
    async execute(userId, dayNumber, mealName) {
        // 1. هات الخطة النشطة لليوزر ده
        const plan = await this.nutritionRepository.getActivePlanByUserId(userId);
        if (!plan) {
            throw new AppError_1.AppError("No active nutrition plan found to update.", 404);
        }
        // 2. نفذ التغيير جوه الـ Entity
        try {
            plan.toggleMeal(dayNumber, mealName);
        }
        catch (error) {
            throw new AppError_1.AppError(error.message, 400);
        }
        // 3. احفظ الـ Entity بعد التعديل
        await this.nutritionRepository.save(plan);
        return plan;
    }
}
exports.ToggleMealStatus = ToggleMealStatus;
