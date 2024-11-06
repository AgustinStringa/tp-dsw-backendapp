import express from "express";
import { controller } from "./Trainer.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const trainerRouter = express.Router();

trainerRouter.get("/:id", authController.verifyTrainer, controller.findOne);
trainerRouter.get("/", authController.verifyTrainer, controller.findAll);

trainerRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeTrainer,
  controller.add
);

trainerRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeTrainer,
  controller.update
);

trainerRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeTrainer,
  controller.update
);

trainerRouter.delete("/:id", authController.verifyTrainer, controller.delete);
