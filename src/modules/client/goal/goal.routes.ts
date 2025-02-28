import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./goal.controller.js";

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
  authMiddlewares.verifyTrainer,
  controller.sanitizeGoal,
  controller.add
);

goalRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
