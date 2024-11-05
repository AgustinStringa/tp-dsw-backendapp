import { Router } from "express";
import { controller } from "./Membership.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const membershipRouter = Router();

membershipRouter.get("/:id", authController.verifyTrainer, controller.findOne);
membershipRouter.get("/", authController.verifyTrainer, controller.findAll);

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
