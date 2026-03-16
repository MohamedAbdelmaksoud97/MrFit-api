"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiWorkoutGenerator = void 0;
// src/modules/workout/infrastructure/services/GeminiWorkoutGenerator.ts
const generative_ai_1 = require("@google/generative-ai");
const AppError_1 = require("../../../../shared/domain/errors/AppError");
class GeminiWorkoutGenerator {
    genAI;
    constructor(apiKey) {
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async generatePlan(user) {
        try {
            // استخدام نفس الموديل اللي نجح معاك
            const model = this.genAI.getGenerativeModel({
                model: "gemini-3-flash-preview",
            });
            const userProfile = user.getProfile();
            const prompt = `
        Act as a world-class Strength and Conditioning Coach. 
        Generate a highly personalized 7-day workout split for:
        - Goal: ${userProfile.goal}
        - Fitness Level: ${userProfile.fitnessLevel} (Very Important: Adjust volume and intensity accordingly)
        - Gender: ${userProfile.gender}

        REQUIREMENTS:
        1. Choose an appropriate split (e.g., PPL, Full Body, Upper/Lower) based on their level.
        2. Include rest days.
        3. For each exercise, provide specific sets, reps (or "To Failure"), and rest time.
        4. Provide expert cues in "notes".

        IMPORTANT: Return ONLY a raw JSON object. No markdown, no backticks, no preamble.
        STRUCTURE:
        {
          "splitType": "string (e.g., Push Pull Legs)",
          "days": [
            {
              "dayNumber": number,
              "dayName": "string",
              "isRestDay": boolean,
              "workoutTitle": "string (e.g., Chest and Triceps)",
              "exercises": [
                {
                  "name": "string",
                  "muscleGroup": "string",
                  "sets": number,
                  "reps": "string",
                  "restSeconds": number,
                  "notes": "string"
                }
              ]
            }
          ]
        }
      `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // تنظيف النص لضمان إنه JSON صالح
            const cleanJson = text.replace(/```json|```/g, "").trim();
            return JSON.parse(cleanJson);
        }
        catch (error) {
            console.error("DEBUG - GEMINI WORKOUT ERROR:", error);
            throw new AppError_1.AppError(`Workout AI Error: ${error.message || "Model connection failed"}`, 500);
        }
    }
}
exports.GeminiWorkoutGenerator = GeminiWorkoutGenerator;
