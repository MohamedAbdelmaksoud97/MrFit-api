"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionController = void 0;
const CatchAsync_1 = require("../../../shared/domain/errors/CatchAsync");
const AppError_1 = require("../../../shared/domain/errors/AppError");
class NutritionController {
    generatePlanUseCase;
    nutritionRepository;
    constructor(generatePlanUseCase, nutritionRepository) {
        this.generatePlanUseCase = generatePlanUseCase;
        this.nutritionRepository = nutritionRepository;
    }
    // POST /api/v1/nutrition/generate
    generate = (0, CatchAsync_1.catchAsync)(async (req, res) => {
        // Assuming 'req.user' is populated by your Auth middleware
        const userId = req.user.id;
        await this.nutritionRepository.archiveAllActivePlans(userId);
        const plan = await this.generatePlanUseCase.execute(userId);
        if (!plan) {
            throw new AppError_1.AppError("Failed to generate nutrition plan , please try again .");
        }
        res.status(201).json({
            status: "success",
            data: { plan },
        });
    });
}
exports.NutritionController = NutritionController;
