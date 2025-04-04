import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./progress.controller.js";
import { Router } from "express";

export const progressRouter = Router();

progressRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
progressRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

progressRouter.post(
  "/",
  authMiddlewares.verifyClient,
  controller.sanitizeProgress,
  controller.add
);

progressRouter.put(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeProgress,
  controller.update
);

progressRouter.patch(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeProgress,
  controller.update
);

progressRouter.delete("/:id", authMiddlewares.verifyClient, controller.delete);

export const progressByClientRouter = Router({ mergeParams: true });
progressByClientRouter.get(
  "/",
  authMiddlewares.verifyClient,
  controller.findByClient
);
