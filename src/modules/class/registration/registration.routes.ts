import { Router } from "express";
import { controller } from "./registration.controller.js";
import { controller as authController } from "../../auth/auth/auth.controller.js";

export const registrationRouter = Router();

registrationRouter.get(
  "/client/:id",
  authController.verifyUser,
  controller.findByClient
);
registrationRouter.get(
  "/:id",
  authController.verifyTrainer,
  controller.findOne
);
registrationRouter.get("/", authController.verifyTrainer, controller.findAll);

registrationRouter.post(
  "/",
  authController.verifyUser,
  controller.sanitizeRegistration,
  controller.add
);

registrationRouter.patch(
  "/cancel/:id",
  authController.verifyUser,
  controller.cancel
);
