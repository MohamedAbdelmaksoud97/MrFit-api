"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meal = void 0;
class Meal {
    name;
    mealType;
    ingredients;
    macros;
    isEconomic;
    isCompleted;
    completedAt;
    constructor(name, mealType, ingredients, macros, isEconomic, isCompleted = false, completedAt) {
        this.name = name;
        this.mealType = mealType;
        this.ingredients = ingredients;
        this.macros = macros;
        this.isEconomic = isEconomic;
        this.isCompleted = isCompleted;
        this.completedAt = completedAt;
    }
    complete() {
        this.isCompleted = true;
        this.completedAt = new Date();
    }
}
exports.Meal = Meal;
