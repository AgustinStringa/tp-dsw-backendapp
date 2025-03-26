import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./membership-type.controller.js";

export const membershipTypeRouter = Router();

membershipTypeRouter.get(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.findOne
);

membershipTypeRouter.get("/", authMiddlewares.verifyUser, controller.findAll);

membershipTypeRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.add
);

membershipTypeRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.update
);

membershipTypeRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.update
);

membershipTypeRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
