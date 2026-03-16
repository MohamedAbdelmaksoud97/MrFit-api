"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveWorkoutController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
class GetActiveWorkoutController {
    getActiveWorkoutUseCase;
    constructor(getActiveWorkoutUseCase) {
        this.getActiveWorkoutUseCase = getActiveWorkoutUseCase;
    }
    execute = (0, CatchAsync_1.catchAsync)(async (req, res) => {
        // اليوزر آي دي جاي من الـ Protect Middleware
        const userId = req.user.id;
        const plan = await this.getActiveWorkoutUseCase.execute(userId);
        if (!plan) {
            return res.status(200).json({
                status: "success",
                message: "No active workout plan found. Time to generate one!",
                data: null,
            });
        }
        res.status(200).json({
            status: "success",
            data: { plan },
        });
    });
}
exports.GetActiveWorkoutController = GetActiveWorkoutController;
