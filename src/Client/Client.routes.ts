import { Router } from "express";
import { controller } from "./Client.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";
export const clientRouter = Router();

clientRouter.get("/", authController.verifyTrainer, controller.findAll); //trainer
clientRouter.get("/:id", authController.verifyTrainer, controller.findOne);
clientRouter.post("/", controller.sanitizeClient, controller.add); //client y trainer
clientRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClient,
  controller.update
); //trainer
clientRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClient,
  controller.update
);
clientRouter.delete("/:id", authController.verifyTrainer, controller.delete);
