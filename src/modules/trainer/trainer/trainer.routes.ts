import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./trainer.controller.js";
import express from "express";

export const trainerRouter = express.Router();

trainerRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
trainerRouter.get("/", authMiddlewares.verifyUser, controller.findAll);

trainerRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeTrainer,
  controller.add
);

trainerRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeTrainer,
  controller.update
);

trainerRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeTrainer,
  controller.update
);

trainerRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
