import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./client.controller.js";
import { Router } from "express";

export const clientRouter = Router();

clientRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
clientRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);
clientRouter.post("/", controller.sanitizeClient, controller.add); //un visitante se puede registrar

clientRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClient,
  controller.update
);

clientRouter.patch(
  "/self-update/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeSelfUpdate,
  controller.update
);

clientRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClient,
  controller.update
);

clientRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
