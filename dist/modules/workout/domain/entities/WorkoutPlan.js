"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlan = void 0;
const uuid_1 = require("uuid");
const Exercise_1 = require("../value-objects/Exercise");
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class WorkoutPlan {
    id;
    userId;
    fitnessLevelSnapshot;
    goalSnapshot;
    splitType;
    days;
    status;
    constructor(props, id) {
        this.id = id || (0, uuid_1.v4)();
        this.userId = props.userId;
        this.fitnessLevelSnapshot = props.fitnessLevelSnapshot;
        this.goalSnapshot = props.goalSnapshot;
        this.splitType = props.splitType;
        this.days = props.days.map((day) => ({
            ...day,
            exercises: day.exercises
                ? day.exercises.map((ex) => new Exercise_1.Exercise(ex.name, ex.muscleGroup, ex.sets, ex.reps, ex.isCompleted ?? false, ex.restSeconds, ex.notes))
                : [],
        }));
        this.status = props.status || "active";
    }
    toggleExercise(dayNumber, exerciseName) {
        const day = this.days.find((d) => d.dayNumber === dayNumber);
        if (!day)
            throw new AppError_1.AppError("Day not found in this plan", 404);
        const exercise = day.exercises.find((e) => e.name === exerciseName);
        if (!exercise)
            throw new AppError_1.AppError("Exercise not found in this day", 404);
        exercise.isCompleted = !exercise.isCompleted;
    }
    archive() {
        this.status = "archived";
    }
    getId() {
        return this.id;
    }
    getUserId() {
        return this.userId;
    }
    getDays() {
        console.log("[WorkoutPlan] Returning days", this.days);
        return this.days;
    }
}
exports.WorkoutPlan = WorkoutPlan;
