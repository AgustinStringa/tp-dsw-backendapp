import { Router } from "express";
import { controller } from "./Goal.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const goalRouter = Router();

goalRouter.get("/:id", authController.verifyTrainer, controller.findOne);
goalRouter.get("/", authController.verifyTrainer, controller.findAll);

goalRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeGoal,
  controller.add
);

goalRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.delete("/:id", authController.verifyTrainer, controller.delete);
