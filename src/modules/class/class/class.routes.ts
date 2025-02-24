import { Router } from "express";
import { controller } from "./class.controller.js";
import { controller as authController } from "../../auth/auth/auth.controller.js";

export const classRouter = Router();

classRouter.get("/:id", authController.verifyTrainer, controller.findOne);
classRouter.get("/", authController.verifyUser, controller.findAll); //trainer & client

classRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeClass,
  controller.add
); //trainer

classRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClass,
  controller.update
);

classRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeClass,
  controller.update
);

classRouter.delete("/:id", authController.verifyTrainer, controller.delete);
