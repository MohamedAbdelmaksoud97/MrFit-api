"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutModel = void 0;
// src/modules/workout/infrastructure/models/WorkoutPlanModel.ts
const mongoose_1 = __importDefault(require("mongoose"));
const WorkoutPlanSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true, unique: true },
    userId: { type: String, ref: "User", required: true },
    fitnessLevelSnapshot: String,
    goalSnapshot: String,
    splitType: String,
    status: { type: String, enum: ["active", "archived"], default: "active" },
    days: [
        {
            dayNumber: Number,
            dayName: String,
            isRestDay: Boolean,
            workoutTitle: String,
            exercises: [
                {
                    name: String,
                    muscleGroup: String,
                    sets: Number,
                    reps: String,
                    isCompleted: Boolean,
                    restSeconds: Number,
                    notes: String,
                },
            ],
        },
    ],
}, { timestamps: true, _id: false });
exports.WorkoutModel = mongoose_1.default.model("WorkoutPlan", WorkoutPlanSchema);
