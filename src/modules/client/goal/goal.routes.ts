import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./goal.controller.js";
import { Router } from "express";

export const goalRouter = Router();

goalRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
goalRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);
goalRouter.get(
  "/client/:id",
  authMiddlewares.verifyClient,
  controller.findByClient
);

goalRouter.post(
  "/",
  authMiddlewares.verifyClient,
  controller.sanitizeGoal,
  controller.add
);

goalRouter.put(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.patch(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.delete("/:id", authMiddlewares.verifyClient, controller.delete);
