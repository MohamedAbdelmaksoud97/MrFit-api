"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserProfile = void 0;
const uuid_1 = require("uuid");
const AppError_1 = require("../../../../shared/domain/errors/AppError");
// 1. كلاس فرعي لبيانات الجسم (Value Object)
class UserProfile {
    age;
    height;
    gender;
    fitnessLevel;
    weight;
    goal;
    fatPercentage;
    budgetLevel;
    constructor(age, height, gender, fitnessLevel, weight, goal, fatPercentage, budgetLevel) {
        this.age = age;
        this.height = height;
        this.gender = gender;
        this.fitnessLevel = fitnessLevel;
        this.weight = weight;
        this.goal = goal;
        this.fatPercentage = fatPercentage;
        this.budgetLevel = budgetLevel;
        if (age < 15) {
            throw new AppError_1.AppError("Application is only for individuals over 15 years old", 400);
        }
        if (weight <= 0) {
            throw new AppError_1.AppError("Weight must be a positive number", 400);
        }
        if (height <= 0) {
            throw new AppError_1.AppError("Height must be a positive number", 400);
        }
        if (fatPercentage !== undefined && (fatPercentage < 0 || fatPercentage > 100)) {
            throw new AppError_1.AppError("Fat percentage must be between 0 and 100", 400);
        }
        const validFitnessLevels = ["Beginner", "Intermediate", "Advanced"];
        if (!validFitnessLevels.includes(fitnessLevel)) {
            throw new AppError_1.AppError(`Invalid fitness level. Must be one of: ${validFitnessLevels.join(", ")}`, 400);
        }
        const validGoals = ["Losing Weight", "Building Muscle", "Maintenance"];
        if (!validGoals.includes(goal)) {
            throw new AppError_1.AppError(`Invalid goal. Must be one of: ${validGoals.join(", ")}`, 400);
        }
        if (budgetLevel && !["Economic", "Average", "High"].includes(budgetLevel)) {
            throw new AppError_1.AppError("Invalid budget level provided", 400);
        }
    }
}
exports.UserProfile = UserProfile;
class User {
    id;
    username;
    email;
    passwordHash;
    isVerified = false; // حالة التحقق من الإيميل
    passwordUpdatedAt;
    profile; // استخدام الـ Composition هنا
    constructor(username, email, passwordHash, profile, id, passwordUpdatedAt) {
        this.id = id || (0, uuid_1.v4)();
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.passwordUpdatedAt = passwordUpdatedAt || new Date();
        this.profile = profile;
    }
    // Getters
    getProfile() {
        return this.profile;
    }
    setProfile(newProfile) {
        this.profile = newProfile;
    }
    getEmail() {
        return this.email;
    }
    getName() {
        return this.username;
    }
    getPassword() {
        return this.passwordHash;
    }
    getId() {
        return this.id;
    }
    setVerified(status) {
        this.isVerified = status;
    }
    getVerificationStatus() {
        return this.isVerified;
    }
    setPassword(newPasswordHash) {
        this.passwordHash = newPasswordHash;
    }
    getPasswordUpdatedAt() {
        return this.passwordUpdatedAt;
    }
    setPasswordUpdatedAt(date) {
        this.passwordUpdatedAt = date;
    }
    // Business Logic: تحديث بيانات الجسم
    updateBodyStats(newWeight, newFat) {
        // بنعمل Copy من البروفايل القديم مع تحديث الوزن
        this.profile = new UserProfile(this.profile.age, this.profile.height, this.profile.gender, this.profile.fitnessLevel, newWeight, this.profile.goal, newFat, this.profile.budgetLevel);
    }
}
exports.User = User;
