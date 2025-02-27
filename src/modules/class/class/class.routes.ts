import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./class.controller.js";

export const classRouter = Router();

classRouter.get("/active", authMiddlewares.verifyUser, controller.findActive);
classRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
classRouter.get("/", authMiddlewares.verifyUser, controller.findAll);

classRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClass,
  controller.add
);

classRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClass,
  controller.update
);

classRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClass,
  controller.update
);

classRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
