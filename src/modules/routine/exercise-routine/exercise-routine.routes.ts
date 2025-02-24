import { Router } from "express";
import { controller } from "./exercise-routine.controller.js";
import { controller as authController } from "../../auth/auth/auth.controller.js";

export const exerciseRoutineRouter = Router();

exerciseRoutineRouter.get(
  "/:id",
  authController.verifyTrainer,
  controller.findOne
);

exerciseRoutineRouter.get(
  "/",
  authController.verifyTrainer,
  controller.findAll
);

exerciseRoutineRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.add
);

exerciseRoutineRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.update
);

//TODO verificar si es un trainer o un client (si es client solo puede modificar un ejercicio de su rutina actual)
exerciseRoutineRouter.patch(
  "/:id",
  authController.verifyUser,
  controller.sanitizeExerciseRoutine,
  controller.update
);

exerciseRoutineRouter.delete(
  "/:id",
  authController.verifyTrainer,
  controller.delete
);
