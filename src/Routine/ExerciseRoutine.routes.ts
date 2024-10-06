import { Router } from "express";
import { controller } from "./ExerciseRoutine.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const exerciseRoutineRouter = Router();

exerciseRoutineRouter.get(
  "/",
  authController.verifyTrainer,
  controller.findAll
);
exerciseRoutineRouter.get("/:id", controller.findOne);
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
//client
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
