"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveNutritionPlan = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
class GetActiveNutritionPlan {
    getTheActivePlanUseCase;
    constructor(getTheActivePlanUseCase) {
        this.getTheActivePlanUseCase = getTheActivePlanUseCase;
    }
    execute = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        // Assuming 'req.user' is populated by your Auth middleware
        const userId = req.user.id;
        const plan = await this.getTheActivePlanUseCase.execute(userId);
        if (!plan) {
            res.status(404).json({
                status: "fail",
                message: "No active nutrition plan found for this user.",
            });
            return;
        }
        res.status(200).json({
            status: "success",
            data: { plan },
        });
    });
}
exports.GetActiveNutritionPlan = GetActiveNutritionPlan;
