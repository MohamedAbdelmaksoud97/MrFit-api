import { v4 as uuidv4 } from "uuid";
import { Exercise } from "../value-objects/Exercise";

export class WorkoutPlan {
  private id: string;
  private userId: string;
  private fitnessLevelSnapshot: string; // Beginner, Intermediate, Advanced
  private goalSnapshot: string;
  private splitType: string; // Full Body, PPL, Upper/Lower
  private days: {
    dayNumber: number;
    dayName: string;
    isRestDay: boolean;
    workoutTitle?: string; // "Chest & Triceps"
    exercises: Exercise[];
  }[];
  private status: "active" | "archived";

  constructor(props: any, id?: string) {
    this.id = id || uuidv4();
    this.userId = props.userId;
    this.fitnessLevelSnapshot = props.fitnessLevelSnapshot;
    this.goalSnapshot = props.goalSnapshot;
    this.splitType = props.splitType;
    this.days = props.days;
    this.status = props.status || "active";
  }

  public archive() {
    this.status = "archived";
  }
  public getId() {
    return this.id;
  }
  public getUserId() {
    return this.userId;
  }
  public getDays() {
    return this.days;
  }
}
