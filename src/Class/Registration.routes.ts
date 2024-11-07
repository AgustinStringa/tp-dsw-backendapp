import { Router } from "express";
import { controller } from "./Registration.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

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

registrationRouter.put(
  "/:id",
  authController.verifyUser,
  controller.sanitizeRegistration,
  controller.update
);

registrationRouter.patch(
  "/:id",
  authController.verifyUser,
  controller.sanitizeRegistration,
  controller.update
);

registrationRouter.delete("/:id", authController.verifyUser, controller.delete);
