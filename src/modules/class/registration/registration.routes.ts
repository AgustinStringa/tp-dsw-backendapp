import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./registration.controller.js";
import { Router } from "express";

export const registrationRouter = Router();

registrationRouter.get(
  "/client/:id",
  authMiddlewares.verifyUser,
  controller.findByClient
);
registrationRouter.get(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.findOne
);
registrationRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

registrationRouter.post(
  "/",
  authMiddlewares.verifyUser,
  controller.sanitizeRegistration,
  controller.add
);

registrationRouter.patch(
  "/cancel/:id",
  authMiddlewares.verifyUser,
  controller.cancel
);
