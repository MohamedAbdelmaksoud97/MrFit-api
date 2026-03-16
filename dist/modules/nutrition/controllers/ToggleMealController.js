"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleMealController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class ToggleMealController {
    toggleMealStatusUseCase;
    constructor(toggleMealStatusUseCase) {
        this.toggleMealStatusUseCase = toggleMealStatusUseCase;
    }
    execute = (0, CatchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user.id;
        const { dayNumber, mealName } = req.body;
        if (!dayNumber || !mealName) {
            throw new AppError_1.AppError("Please provide dayNumber and mealName", 400);
        }
        const updatedPlan = await this.toggleMealStatusUseCase.execute(userId, dayNumber, mealName);
        res.status(200).json({
            status: "success",
            message: "Meal status updated successfully",
            data: { plan: updatedPlan },
        });
    });
}
exports.ToggleMealController = ToggleMealController;
