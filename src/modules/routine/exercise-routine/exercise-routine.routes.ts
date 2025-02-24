import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./exercise-routine.controller.js";

export const exerciseRoutineRouter = Router();

exerciseRoutineRouter.get(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.findOne
);

exerciseRoutineRouter.get(
  "/",
  authMiddlewares.verifyTrainer,
  controller.findAll
);

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

//TODO verificar si es un trainer o un client (si es client solo puede modificar un ejercicio de su rutina actual)
exerciseRoutineRouter.patch(
  "/:id",
  authMiddlewares.verifyUser,
  controller.sanitizeExerciseRoutine,
  controller.update
);

exerciseRoutineRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
