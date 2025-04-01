import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./exercise-routine.controller.js";
import { Router } from "express";

export const exerciseRoutineRouter = Router();

exerciseRoutineRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.add
);

exerciseRoutineRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.update
);

exerciseRoutineRouter.patch(
  "/:id/record-execution/",
  authMiddlewares.verifyClient,
  controller.sanitizeExecution,
  controller.markAsDone
);

exerciseRoutineRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.update
);

exerciseRoutineRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
