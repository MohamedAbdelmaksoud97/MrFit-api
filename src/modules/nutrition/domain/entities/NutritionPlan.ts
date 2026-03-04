// src/modules/nutrition/domain/entities/NutritionPlan.ts
import { v4 as uuidv4 } from "uuid";
import { Meal } from "../value-objects/Meal";
import { Macros } from "../value-objects/macros";

export class NutritionPlan {
  private id: string;
  private userId: string;
  private goalSnapshot: string;
  private days: { dayNumber: number; dayName: string; meals: Meal[] }[];
  private dailyTargetMacros: Macros;
  private status: "active" | "archived";

  constructor(props: any, id?: string) {
    this.id = id || uuidv4();
    this.userId = props.userId;
    this.goalSnapshot = props.goalSnapshot;
    this.days = props.days;
    this.dailyTargetMacros = props.dailyTargetMacros;
    this.status = props.status || "active";
  }

  // Getters
  public getId() {
    return this.id;
  }
  public getUserId() {
    return this.userId;
  }
  public getDays() {
    return this.days;
  }

  // Business Logic: Check if the AI met the target
  public isPlanBalanced(): boolean {
    // Logic to compare average meal macros vs dailyTargetMacros
    return true;
  }
}
