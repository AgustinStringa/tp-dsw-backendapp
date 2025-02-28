import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./routine.controller.js";

export const routineRouter = Router();

routineRouter.get("/:id", authMiddlewares.verifyUser, controller.findOne);
routineRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

routineRouter.get(
  "/:userId/current",
  authMiddlewares.verifyClient,
  controller.findCurrentRoutine
);

routineRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeRoutine,
  controller.add
);

routineRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeRoutine,
  controller.update
);

routineRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeRoutine,
  controller.update
);

routineRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
