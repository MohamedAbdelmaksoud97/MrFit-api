"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingredient = void 0;
class Ingredient {
    item;
    amount;
    isOptional;
    constructor(item, amount, isOptional = false) {
        this.item = item;
        this.amount = amount;
        this.isOptional = isOptional;
    }
}
exports.Ingredient = Ingredient;
