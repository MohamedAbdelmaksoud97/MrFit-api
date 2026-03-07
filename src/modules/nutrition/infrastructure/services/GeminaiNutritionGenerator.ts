// src/modules/nutrition/infrastructure/services/GeminiNutritionGenerator.ts
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { IAiGenerator } from "../../domain/interfaces/IAiGenerator";
import { User } from "../../../user/domain/entities/User";
import { AppError } from "../../../../shared/domain/errors/AppError";

export class GeminiNutritionGenerator implements IAiGenerator {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async execute(user: User): Promise<any> {
    try {
      // التعديل 1: استخدام الاسم الكامل للموديل
      const model = this.genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
      });

      const userProfile = user.getProfile();

      // التعديل 2: تأكيد طلب الـ JSON في الـ Prompt نفسه
      const prompt = `
        You are a professional nutritionist. Generate a 7-day nutrition plan for:
        Goal: ${userProfile.goal}, Weight: ${userProfile.weight}kg, Budget: ${userProfile.budgetLevel}.
        
        IMPORTANT: Return ONLY a raw JSON object. No markdown, no backticks ( \`\`\` ), no preamble.
        Use this exact structure:
        {
          "dailyTargetMacros": { "calories": 2500, "protein": 150, "carbs": 300, "fats": 70 },
          "totalWeeklyBudgetEstimate": 500,
          "days": [
            {
              "dayNumber": 1,
              "dayName": "Saturday",
              "meals": [
                {
                  "mealType": "Breakfast",
                  "name": "Oatmeal",
                  "ingredients": [{"item": "Oats", "amount": "50g", "isOptional": false}],
                  "macros": {"calories": 300, "protein": 10, "carbs": 50, "fats": 5},
                  "isEconomic": true
                }
              ]
            }
          ]
        }
      `;
      console.log("Checking API Key Length:", this.genAI.apiKey.length);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // التعديل 3: تنظيف الـ Response من أي Markdown محتمل
      const cleanJson = text.replace(/```json|```/g, "").trim();

      return JSON.parse(cleanJson);
    } catch (error: any) {
      console.error("DEBUG - GEMINI ERROR DETAILS:", error);

      // لو لسه 404، هنغير الـ Endpoint يدوياً لـ v1 (النسخة المستقرة)
      throw new AppError(`AI Error: ${error.message || "Model connection failed"}`, 500);
    }
  }
}
