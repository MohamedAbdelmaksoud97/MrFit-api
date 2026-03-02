import { Schema, model, InferSchemaType } from "mongoose";

// 1. Define the Schema first
const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: { type: String, required: true, select: false },
    profile: {
      age: { type: Number, min: 13 },
      height: Number,
      weight: Number,
      fatPercentage: Number,
      goal: {
        type: String,
        enum: ["Losing Weight", "Building Muscle", "Maintenance"],
        default: "Maintenance",
      },
      budgetLevel: {
        type: String,
        enum: ["Economic", "Average", "High"],
      },
      injuries: [String],
      excludedFoods: [String],
      dailyMacros: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
      },
    },
  },
  {
    timestamps: true,
    // Latest Mongoose 8+ optimization:
  },
);

// 2. Infer the Type from the Schema (Automatic Sync)
export type User = InferSchemaType<typeof userSchema>;

// 3. Create and Export the Model
export const UserModel = model<User>("User", userSchema);
