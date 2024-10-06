import { Router } from "express";
import { controller } from "./Class.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";
export const classRouter = Router();

classRouter.get("/", authController.verifyUser, controller.findAll); //trainer & client
classRouter.get("/:id", authController.verifyTrainer, controller.findOne);
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
