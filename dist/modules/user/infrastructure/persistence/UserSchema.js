"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
// 1. Define the Schema first
const userSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    // Latest Mongoose 8+ optimization:
});
// 3. Create and Export the Model
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
