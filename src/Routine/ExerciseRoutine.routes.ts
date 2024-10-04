import { Router } from "express";
import { controller } from "./ExerciseRoutine.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";
export const exerciseRoutineRouter = Router();

exerciseRoutineRouter.get("/", authController.verifyClient, controller.findAll);
exerciseRoutineRouter.get("/:id", controller.findOne);
exerciseRoutineRouter.post(
  "/",
  controller.sanitizeExerciseRoutine,
  controller.add
);
exerciseRoutineRouter.put(
  "/:id",
  controller.sanitizeExerciseRoutine,
  controller.update
);
exerciseRoutineRouter.patch(
  "/:id",
  controller.sanitizeExerciseRoutine,
  controller.update
);
exerciseRoutineRouter.delete("/:id", controller.delete);
