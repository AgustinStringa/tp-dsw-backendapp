import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./class-type.controller.js";
import { Router } from "express";

export const classTypeRouter = Router();

classTypeRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);
classTypeRouter.get("/", authMiddlewares.verifyUser, controller.findAll);

classTypeRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClassType,
  controller.add
);

classTypeRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClassType,
  controller.update
);

classTypeRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClassType,
  controller.update
);

classTypeRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
