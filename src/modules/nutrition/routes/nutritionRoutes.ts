// src/modules/nutrition/infrastructure/routes/nutritionRoutes.ts
import { Router } from "express";
import { NutritionController } from "../controllers/NutritionController";
import { GenerateNutritionPlan } from "../application/use-cases/GenerateNutritionPlan";
import { FakeAiGenerator } from "../infrastructure/services/FakeAiGenerator";
import { FakeNutritionRepository } from "../infrastructure/services/FakeNutritionRepository";
// Assume you have these from your User module
import {
  FakeUserRepository,
  sharedUserRepository,
} from "../../user/infrastructure/repositories/fakeRepository";
import { ProtectController } from "../../user/controllers/ProtectController";
import { Protect } from "../../user/application/use-cases/Protect";
import { JwtTokenEmailVerificationService } from "../../user/infrastructure/services/JWTService";
import { GetActiveNutritionPlan } from "../controllers/GetActiveNutritionPlan";
import { GetTheActivePlan } from "../application/use-cases/GetTheActivePlan";
import { ToggleMealController } from "../controllers/ToggleMealController";
import { ToggleMealStatus } from "../application/use-cases/ToggleMealStatus";

const router = Router();

// 1. Initialize Dependencies (Fakes)
const fakeAi = new FakeAiGenerator();
const fakeRepo = new FakeNutritionRepository();
const userRepo = sharedUserRepository; // Real or Fake

const tokenService = new JwtTokenEmailVerificationService();
const protectUseCase = new Protect(tokenService, userRepo);
const protectController = new ProtectController(protectUseCase);

// 2. Initialize Use Case
const generatePlanUseCase = new GenerateNutritionPlan(fakeAi, fakeRepo, userRepo);

// 3. Initialize Controller
const nutritionController = new NutritionController(generatePlanUseCase, fakeRepo);
const getTheActivePlan = new GetTheActivePlan(fakeRepo, userRepo);
const getActivePlanController = new GetActiveNutritionPlan(getTheActivePlan);

const toggleMealUseCase = new ToggleMealStatus(fakeRepo);
const toggleMealController = new ToggleMealController(toggleMealUseCase);

// 4. Define Routes
router.post(
  "/generate",
  (req, res, next) => protectController.execute(req, res, next),
  (req, res, next) => nutritionController.generate(req, res, next),
);

router.get(
  "/active",
  (req, res, next) => protectController.execute(req, res, next),
  (req, res, next) => getActivePlanController.execute(req, res, next),
);

router.patch(
  "/toggle-meal",
  (req, res, next) => protectController.execute(req, res, next),
  (req, res, next) => toggleMealController.execute(req, res, next),
);

export default router;
