import { Router } from "express";
import { controller } from "./MembershipType.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const membershipTypeRouter = Router();

membershipTypeRouter.get(
  "/:id",
  authController.verifyTrainer,
  controller.findOne
);

membershipTypeRouter.get("/", authController.verifyTrainer, controller.findAll);

membershipTypeRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.add
);

membershipTypeRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.update
);

membershipTypeRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.update
);

membershipTypeRouter.delete(
  "/:id",
  authController.verifyTrainer,
  controller.delete
);
