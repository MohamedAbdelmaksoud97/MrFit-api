// src/modules/nutrition/infrastructure/models/NutritionPlanModel.ts
import mongoose from "mongoose";

const NutritionPlanSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

export const NutritionModel = mongoose.model("NutritionPlan", NutritionPlanSchema);
