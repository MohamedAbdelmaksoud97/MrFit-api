import { v4 as uuidv4 } from "uuid";
import { Exercise } from "../value-objects/Exercise";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class WorkoutPlan {
  private id: string;
  private userId: string;
  private fitnessLevelSnapshot: string;
  private goalSnapshot: string;
  private splitType: string;
  private days: {
    dayNumber: number;
    dayName: string;
    isRestDay: boolean;
    workoutTitle?: string;
    exercises: Exercise[];
  }[];
  private status: "active" | "archived";

  constructor(props: any, id?: string) {
    this.id = id || uuidv4();
    this.userId = props.userId;
    this.fitnessLevelSnapshot = props.fitnessLevelSnapshot;
    this.goalSnapshot = props.goalSnapshot;
    this.splitType = props.splitType;
    this.days = props.days.map((day: any) => ({
      ...day,
      exercises: day.exercises
        ? day.exercises.map(
            (ex: any) =>
              new Exercise(
                ex.name,
                ex.muscleGroup,
                ex.sets,
                ex.reps,
                ex.isCompleted ?? false,
                ex.restSeconds,
                ex.notes,
              ),
          )
        : [],
    }));
    this.status = props.status || "active";
  }
  public toggleExercise(dayNumber: number, exerciseName: string) {
    const day = this.days.find((d) => d.dayNumber === dayNumber);
    if (!day) throw new AppError("Day not found in this plan", 404);
    const exercise = day.exercises.find((e) => e.name === exerciseName);
    if (!exercise) throw new AppError("Exercise not found in this day", 404);
    exercise.isCompleted = !exercise.isCompleted;
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
    console.log("[WorkoutPlan] Returning days", this.days);
    return this.days;
  }
}
