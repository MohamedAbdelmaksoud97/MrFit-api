"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionPlan = void 0;
// src/modules/nutrition/domain/entities/NutritionPlan.ts
const uuid_1 = require("uuid");
class NutritionPlan {
    id;
    userId;
    goalSnapshot;
    days;
    dailyTargetMacros;
    status;
    constructor(props, id) {
        this.id = id || (0, uuid_1.v4)();
        this.userId = props.userId;
        this.goalSnapshot = props.goalSnapshot;
        this.days = props.days;
        this.dailyTargetMacros = props.dailyTargetMacros;
        this.status = props.status || "active";
    }
    // Getters
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getDays() {
        return this.days;
    }
    // Business Logic: Check if the AI met the target
    isPlanBalanced() {
        // Logic to compare average meal macros vs dailyTargetMacros
        return true;
    }
    toggleMeal(dayNumber, mealName) {
        const day = this.days.find((d) => d.dayNumber === dayNumber);
        if (!day)
            throw new Error("Day not found in this plan");
        const meal = day.meals.find((m) => m.name === mealName);
        if (!meal)
            throw new Error("Meal not found in this day");
        // Toggle logic
        meal.isCompleted = !meal.isCompleted;
        meal.completedAt = meal.isCompleted ? new Date() : undefined;
    }
}
exports.NutritionPlan = NutritionPlan;
