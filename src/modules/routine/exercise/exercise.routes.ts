import express from "express";
import { controller } from "./exercise.controller.js";
import { controller as authController } from "../../auth/auth/auth.controller.js";

export const exerciseRouter = express.Router();

exerciseRouter.get("/:id", authController.verifyTrainer, controller.findOne);
exerciseRouter.get("/", authController.verifyTrainer, controller.findAll);

exerciseRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeExercise,
  controller.add
);

exerciseRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);

exerciseRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);

exerciseRouter.delete("/:id", authController.verifyTrainer, controller.delete);
