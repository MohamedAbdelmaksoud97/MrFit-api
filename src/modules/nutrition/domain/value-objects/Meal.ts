import { Ingredient } from "./Ingredient";
import { Macros } from "./Macros";
export class Meal {
  constructor(
    public readonly name: string,
    public readonly mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack",
    public readonly ingredients: Ingredient[],
    public readonly macros: Macros,
    public readonly isEconomic: boolean,
    public isCompleted: boolean = false,
    public completedAt?: Date,
  ) {}

  public complete() {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
}
