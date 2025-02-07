import { Router } from "express";
import { controller } from "./Goal.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const goalRouter = Router();

goalRouter.get("/:id", authController.verifyClient, controller.findOne);
goalRouter.get("/", authController.verifyClient, controller.findAll);
goalRouter.get(
  "/client/:id",
  authController.verifyClient,
  controller.findByClient
);

goalRouter.post(
  "/",
  authController.verifyClient,
  controller.sanitizeGoal,
  controller.add
);

goalRouter.put(
  "/:id",
  authController.verifyClient,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.patch(
  "/:id",
  authController.verifyClient,
  controller.sanitizeGoal,
  controller.update
);

goalRouter.delete("/:id", authController.verifyClient, controller.delete);
