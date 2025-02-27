import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./membership.controller.js";

export const membershipRouter = Router();

membershipRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
membershipRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);
membershipRouter.get(
  "/active/:id",
  authMiddlewares.verifyClient,
  controller.findActiveByClient
);

membershipRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembership,
  controller.add
);

membershipRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembership,
  controller.update
);

membershipRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembership,
  controller.update
);

membershipRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
