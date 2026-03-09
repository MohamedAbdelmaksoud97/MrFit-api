// src/modules/workout/infrastructure/models/WorkoutPlanModel.ts
import mongoose from "mongoose";

const WorkoutPlanSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true, _id: false },
);

export const WorkoutModel = mongoose.model("WorkoutPlan", WorkoutPlanSchema);
