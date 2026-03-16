"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionModel = void 0;
// src/modules/nutrition/infrastructure/models/NutritionPlanModel.ts
const mongoose_1 = __importDefault(require("mongoose"));
const NutritionPlanSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true, unique: true },
    userId: { type: String, ref: "User", required: true },
    goalSnapshot: String,
    status: { type: String, enum: ["active", "archived"], default: "active" },
    dailyTargetMacros: { calories: Number, protein: Number, carbs: Number, fats: Number },
    days: [
        {
            dayNumber: Number,
            dayName: String,
            meals: [
                {
                    mealType: String,
                    name: String,
                    isCompleted: { type: Boolean, default: false },
                    completedAt: Date,
                    ingredients: [{ item: String, amount: String, isOptional: Boolean }],
                    macros: { calories: Number, protein: Number, carbs: Number, fats: Number },
                },
            ],
        },
    ],
}, { timestamps: true });
exports.NutritionModel = mongoose_1.default.model("NutritionPlan", NutritionPlanSchema);
