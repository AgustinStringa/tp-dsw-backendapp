import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./exercise.controller.js";
import express from "express";

export const exerciseRouter = express.Router();

exerciseRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
exerciseRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

exerciseRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExercise,
  controller.add
);

exerciseRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);

exerciseRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);

exerciseRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
