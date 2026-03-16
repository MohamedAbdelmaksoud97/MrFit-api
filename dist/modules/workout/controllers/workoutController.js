"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class WorkoutController {
    generateUseCase;
    IWorkoutRepository;
    constructor(generateUseCase, IWorkoutRepository) {
        this.generateUseCase = generateUseCase;
        this.IWorkoutRepository = IWorkoutRepository;
    }
    generate = (0, CatchAsync_1.catchAsync)(async (req, res) => {
        const userId = req.user.id;
        await this.IWorkoutRepository.archiveAllActivePlans(userId);
        const plan = await this.generateUseCase.execute(userId);
        if (!plan) {
            throw new AppError_1.AppError("Failed to generate workout plan");
        }
        res.status(201).json({
            status: "success",
            message: "AI has tailored your workout split!",
            data: { plan },
        });
    });
}
exports.WorkoutController = WorkoutController;
