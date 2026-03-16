"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise = void 0;
class Exercise {
    name;
    muscleGroup;
    sets;
    reps;
    isCompleted;
    restSeconds;
    notes;
    constructor(name, muscleGroup, sets, reps, isCompleted = false, restSeconds, notes) {
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.sets = sets;
        this.reps = reps;
        this.isCompleted = isCompleted;
        this.restSeconds = restSeconds;
        this.notes = notes;
    }
}
exports.Exercise = Exercise;
