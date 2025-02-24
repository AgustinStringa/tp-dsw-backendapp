import { Router } from "express";
import { controller } from "./membership.controller.js";
import { controller as authController } from "../../auth/auth/auth.controller.js";

export const membershipRouter = Router();

membershipRouter.get("/:id", authController.verifyTrainer, controller.findOne);
membershipRouter.get("/", authController.verifyTrainer, controller.findAll);
membershipRouter.get(
  "/active/:id",
  authController.verifyClient,
  controller.findActiveByClient
);

membershipRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeMembership,
  controller.add
);

membershipRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeMembership,
  controller.update
);

membershipRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeMembership,
  controller.update
);

membershipRouter.delete(
  "/:id",
  authController.verifyTrainer,
  controller.delete
);
