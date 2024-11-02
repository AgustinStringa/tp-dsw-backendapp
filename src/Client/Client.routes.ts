import { Router } from "express";
import { controller } from "./Client.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const clientRouter = Router();

clientRouter.get("/:id", authController.verifyTrainer, controller.findOne);
clientRouter.get("/", authController.verifyTrainer, controller.findAll);
clientRouter.post("/", controller.sanitizeClient, controller.add); //un visitante se puede registrar

clientRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClient,
  controller.update
); // TODO manejar el caso en el que un cliente modifica sus datos

clientRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClient,
  controller.update
);

clientRouter.delete("/:id", authController.verifyTrainer, controller.delete);
