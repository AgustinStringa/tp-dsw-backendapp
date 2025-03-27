import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./membership.controller.js";
import { Router } from "express";

export const membershipRouter = Router();

membershipRouter.get(
  "/active/",
  authMiddlewares.verifyTrainer,
  controller.findActive
);

membershipRouter.get(
  "/active/:clientId",
  authMiddlewares.verifyClient,
  controller.findActiveByClient
);

membershipRouter.get(
  "/outstanding",
  authMiddlewares.verifyTrainer,
  controller.findOutstandingMemberships
);
membershipRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
membershipRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

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
