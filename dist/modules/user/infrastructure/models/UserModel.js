"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
// src/modules/user/infrastructure/models/UserModel.ts
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    passwordUpdatedAt: { type: Date, default: Date.now },
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
}, {
    _id: false,
    timestamps: true,
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
