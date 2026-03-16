"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/nutrition/infrastructure/routes/nutritionRoutes.ts
const express_1 = require("express");
const NutritionController_1 = require("../controllers/NutritionController");
const GenerateNutritionPlan_1 = require("../application/use-cases/GenerateNutritionPlan");
const FakeAiGenerator_1 = require("../infrastructure/services/FakeAiGenerator");
const GeminaiNutritionGenerator_1 = require("../infrastructure/services/GeminaiNutritionGenerator");
const MongoNutritionRepository_1 = require("../infrastructure/repositories/MongoNutritionRepository");
const ProtectController_1 = require("../../user/controllers/ProtectController");
const Protect_1 = require("../../user/application/use-cases/Protect");
const JWTService_1 = require("../../user/infrastructure/services/JWTService");
const GetActiveNutritionPlan_1 = require("../controllers/GetActiveNutritionPlan");
const GetTheActivePlan_1 = require("../application/use-cases/GetTheActivePlan");
const ToggleMealController_1 = require("../controllers/ToggleMealController");
const ToggleMealStatus_1 = require("../application/use-cases/ToggleMealStatus");
const IMongooseRepository_1 = require("../../user/infrastructure/repositories/IMongooseRepository");
const router = (0, express_1.Router)();
// 1. Initialize Dependencies (Fakes)
const fakeAi = new FakeAiGenerator_1.FakeAiGenerator();
const geminiAi = new GeminaiNutritionGenerator_1.GeminiNutritionGenerator(process.env.GEMINI_API_KEY || "");
const mongoRepo = new MongoNutritionRepository_1.MongoNutritionRepository();
const userRepo = new IMongooseRepository_1.MongoUserRepository(); // Real or Fake
const tokenService = new JWTService_1.JwtTokenEmailVerificationService();
const protectUseCase = new Protect_1.Protect(tokenService, userRepo);
const protectController = new ProtectController_1.ProtectController(protectUseCase);
// 2. Initialize Use Case
const generatePlanUseCase = new GenerateNutritionPlan_1.GenerateNutritionPlan(geminiAi, mongoRepo, userRepo);
// 3. Initialize Controller
const nutritionController = new NutritionController_1.NutritionController(generatePlanUseCase, mongoRepo);
const getTheActivePlan = new GetTheActivePlan_1.GetTheActivePlan(mongoRepo, userRepo);
const getActivePlanController = new GetActiveNutritionPlan_1.GetActiveNutritionPlan(getTheActivePlan);
const toggleMealUseCase = new ToggleMealStatus_1.ToggleMealStatus(mongoRepo);
const toggleMealController = new ToggleMealController_1.ToggleMealController(toggleMealUseCase);
// 4. Define Routes
router.post("/generate", (req, res, next) => protectController.execute(req, res, next), (req, res, next) => nutritionController.generate(req, res, next));
router.get("/active", (req, res, next) => protectController.execute(req, res, next), (req, res, next) => getActivePlanController.execute(req, res, next));
router.patch("/toggle-meal", (req, res, next) => protectController.execute(req, res, next), (req, res, next) => toggleMealController.execute(req, res, next));
exports.default = router;
