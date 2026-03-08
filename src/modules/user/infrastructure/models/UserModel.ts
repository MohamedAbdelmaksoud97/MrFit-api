// src/modules/user/infrastructure/models/UserModel.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profile: {
      age: Number,
      height: Number,
      gender: { type: String, enum: ["Male", "Female"] },
      fitnessLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
      weight: Number,
      goal: { type: String, enum: ["Losing Weight", "Building Muscle", "Maintenance"] },
      fatPercentage: Number,
      budgetLevel: { type: String, enum: ["Economic", "Average", "High"] },
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

export const UserModel = mongoose.model("User", UserSchema);
