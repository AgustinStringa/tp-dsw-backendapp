import { Router } from "express";
import { controller } from "./Registration.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const registrationRouter = Router();

registrationRouter.get("/:id", authController.verifyUser, controller.findOne);
registrationRouter.get("/", authController.verifyUser, controller.findAll);

registrationRouter.post(
  "/",
  authController.verifyClient,
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
