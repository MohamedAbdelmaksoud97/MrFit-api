"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleWorkoutStatusController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
class ToggleWorkoutStatusController {
    toggleStatusUseCase;
    constructor(toggleStatusUseCase) {
        this.toggleStatusUseCase = toggleStatusUseCase;
    }
    // تغليف الميثود بالكامل بـ catchAsync
    toggleExercise = (0, CatchAsync_1.catchAsync)(async (req, res, next) => {
        const userId = req.user.id;
        const { dayNumber, exerciseName } = req.body;
        if (!dayNumber || !exerciseName) {
            // الـ catchAsync هيلقط الخطأ ده ويبعته للـ next(error)
            throw new Error("Missing dayNumber or exerciseName in request body.");
        }
        await this.toggleStatusUseCase.execute({
            userId,
            dayNumber: Number(dayNumber),
            exerciseName,
        });
        res.status(200).json({
            status: "success",
            message: `Successfully toggled status for ${exerciseName}.`,
        });
    });
}
exports.ToggleWorkoutStatusController = ToggleWorkoutStatusController;
