import { Router } from "express";
import { controller } from "./Registration.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";
export const registrationRouter = Router();

registrationRouter.get("/", controller.findAll);
registrationRouter.get("/:id", controller.findOne);
registrationRouter.get(
  "/client/:id",
  authController.verifyClient,
  controller.findByClient
);
registrationRouter.post(
  "/",
  authController.verifyClient,
  controller.sanitizeRegistration,
  controller.add
);
registrationRouter.put(
  "/:id",
  controller.sanitizeRegistration,
  controller.update
);
registrationRouter.patch(
  "/:id",
  controller.sanitizeRegistration,
  controller.update
);
registrationRouter.delete("/:id", controller.delete);
