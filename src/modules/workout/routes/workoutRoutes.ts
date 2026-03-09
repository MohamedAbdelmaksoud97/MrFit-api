import { Router } from "express";
import { WorkoutController } from "../controllers/workoutController";
import { GenerateWorkoutPlan } from "../../workout/application/use-cases/GenerateWorkoutPlan";
import { FakeWorkoutAiGenerator } from "../infrastructures/services/FakeWorkoutAiGenerator";
import { GeminiWorkoutGenerator } from "../infrastructures/services/GeminaiWorkoutGenerator";

import { GetActiveWorkoutPlan } from "../application/use-cases/GetActiveWorkoutPlan";

import { Protect } from "../../user/application/use-cases/Protect";
import { ProtectController } from "../../user/controllers/ProtectController";
import { JwtTokenEmailVerificationService } from "../../user/infrastructure/services/JWTService";
import { sharedUserRepository } from "../../user/infrastructure/repositories/fakeRepository";
import { MongoUserRepository } from "../../user/infrastructure/repositories/IMongooseRepository";
import { FakeWorkoutRepository } from "../infrastructures/services/FakeWorkoutRepository";
import { MongoWorkoutRepository } from "../infrastructures/repositories/MongoWorkoutRepository";
import { GetActiveWorkoutController } from "../controllers/GetActiveWorkoutController";
import { ToggleWorkoutStatus } from "../application/use-cases/ToggleWorkoutStatus";
import { ToggleWorkoutStatusController } from "../controllers/ToggleWorkoutStatusController";
const workoutRouter = Router();
const mongoUserRepo = new MongoUserRepository();

const protectUseCase = new Protect(new JwtTokenEmailVerificationService(), mongoUserRepo);
const protectController = new ProtectController(protectUseCase);

// src/modules/workout/infrastructure/routes/workoutRoutes.ts

// الحقن (Dependency Injection) بنفس فكرة الـ Shared Instances

const workoutAi = new FakeWorkoutAiGenerator();
const workoutRepo = new MongoWorkoutRepository();
const geminiWorkoutAi = new GeminiWorkoutGenerator(process.env.GEMINI_API_KEY || "");

const generateWorkout = new GenerateWorkoutPlan(workoutRepo, mongoUserRepo, geminiWorkoutAi);
const getActiveWorkoutUseCase = new GetActiveWorkoutPlan(workoutRepo);
const getActiveWorkoutController = new GetActiveWorkoutController(getActiveWorkoutUseCase);

const workoutController = new WorkoutController(generateWorkout, workoutRepo);

const toggleWorkoutStatusUseCase = new ToggleWorkoutStatus(workoutRepo);
const toggleWorkoutStatusController = new ToggleWorkoutStatusController(toggleWorkoutStatusUseCase);

workoutRouter.post(
  "/generate",
  (req, res, next) => protectController.execute(req, res, next),
  workoutController.generate,
);
workoutRouter.get(
  "/active",
  (req, res, next) => protectController.execute(req, res, next),
  (req, res, next) => getActiveWorkoutController.execute(req, res, next),
);

workoutRouter.patch(
  "/toggle-exercise",
  (req, res, next) => protectController.execute(req, res, next),
  (req, res, next) => toggleWorkoutStatusController.toggleExercise(req, res, next),
);

export { workoutRouter };
