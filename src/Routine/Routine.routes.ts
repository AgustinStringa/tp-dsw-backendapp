import { Router } from "express";
import { controller } from "./Routine.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const routineRouter = Router();

routineRouter.get("/:id", authController.verifyUser, controller.findOne);
routineRouter.get("/", authController.verifyTrainer, controller.findAll);

routineRouter.get(
  "/:userId/current",
  authController.verifyClient,
  controller.findCurrentRoutine
);

routineRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeRoutine,
  controller.add
);

routineRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeRoutine,
  controller.update
);

routineRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeRoutine,
  controller.update
);

routineRouter.delete("/:id", authController.verifyTrainer, controller.delete);
