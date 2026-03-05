import { Router } from "express";
import { WorkoutController } from "../controllers/workoutController";
import { GenerateWorkoutPlan } from "../../workout/application/use-cases/GenerateWorkoutPlan";
import { FakeWorkoutAiGenerator } from "../infrastructures/services/FakeWorkoutAiGenerator";

import { GetActiveWorkoutPlan } from "../application/use-cases/GetActiveWorkoutPlan";

import { Protect } from "../../user/application/use-cases/Protect";
import { ProtectController } from "../../user/controllers/ProtectController";
import { JwtTokenEmailVerificationService } from "../../user/infrastructure/services/JWTService";
import { sharedUserRepository } from "../../user/infrastructure/repositories/fakeRepository";
import { FakeWorkoutRepository } from "../infrastructures/services/FakeWorkoutRepository";
import { GetActiveWorkoutController } from "../controllers/GetActiveWorkoutController";
const workoutRouter = Router();

const protectUseCase = new Protect(new JwtTokenEmailVerificationService(), sharedUserRepository);
const protectController = new ProtectController(protectUseCase);

// src/modules/workout/infrastructure/routes/workoutRoutes.ts

// الحقن (Dependency Injection) بنفس فكرة الـ Shared Instances

const workoutAi = new FakeWorkoutAiGenerator();
const workoutRepo = new FakeWorkoutRepository();

const generateWorkout = new GenerateWorkoutPlan(workoutRepo, sharedUserRepository, workoutAi);
const getActiveWorkoutUseCase = new GetActiveWorkoutPlan(workoutRepo);
const getActiveWorkoutController = new GetActiveWorkoutController(getActiveWorkoutUseCase);

const workoutController = new WorkoutController(generateWorkout, workoutRepo);

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

export { workoutRouter };
