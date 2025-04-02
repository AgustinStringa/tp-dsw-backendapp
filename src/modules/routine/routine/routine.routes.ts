import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./routine.controller.js";
import { Router } from "express";

export const routineRouter = Router();

routineRouter.get("/:id", authMiddlewares.verifyUser, controller.findOne);
routineRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

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

export const routineByClientRouter = Router({ mergeParams: true });
routineByClientRouter.get(
  "/current",
  authMiddlewares.verifyClient,
  controller.findCurrentRoutine
);
