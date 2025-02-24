import { Router } from "express";
import { controller } from "./class-type.controller.js";
import { controller as authController } from "../../auth/auth/auth.controller.js";

export const classTypeRouter = Router();

classTypeRouter.get("/:id", authController.verifyTrainer, controller.findOne);
classTypeRouter.get("/", authController.verifyUser, controller.findAll);

classTypeRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeClassType,
  controller.add
);

classTypeRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClassType,
  controller.update
);

classTypeRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClassType,
  controller.update
);

classTypeRouter.delete("/:id", authController.verifyTrainer, controller.delete);
