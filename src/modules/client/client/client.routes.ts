import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./client.controller.js";

export const clientRouter = Router();

clientRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
clientRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);
clientRouter.post("/", controller.sanitizeClient, controller.add); //un visitante se puede registrar

clientRouter.put(
  "/:id",
  authMiddlewares.verifyUser,
  controller.sanitizeClient,
  controller.update
);

clientRouter.patch(
  "/:id",
  authMiddlewares.verifyUser,
  controller.sanitizeClient,
  controller.update
);

clientRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
