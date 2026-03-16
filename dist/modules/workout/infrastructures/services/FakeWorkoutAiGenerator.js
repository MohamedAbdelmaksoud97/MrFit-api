"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeWorkoutAiGenerator = void 0;
class FakeWorkoutAiGenerator {
    async generatePlan(user) {
        console.log(`[FakeWorkoutAI] Creating split for ${user.getProfile().goal} ...`);
        return {
            splitType: "Push/Pull/Legs",
            days: [
                {
                    dayNumber: 1,
                    dayName: "Saturday",
                    isRestDay: false,
                    workoutTitle: "Push Day",
                    exercises: [
                        {
                            name: "Dumbbell Press",
                            muscleGroup: "Chest",
                            sets: 3,
                            reps: "12",
                            restSeconds: 60,
                            notes: "Focus on the stretch",
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    dayName: "Sunday",
                    isRestDay: true,
                    exercises: [],
                },
            ],
        };
    }
}
exports.FakeWorkoutAiGenerator = FakeWorkoutAiGenerator;
