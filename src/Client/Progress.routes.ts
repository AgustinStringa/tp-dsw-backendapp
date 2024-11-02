import { Router } from "express";
import { controller } from "./Progress.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const progressRouter = Router();

progressRouter.get("/:id", authController.verifyTrainer, controller.findOne);
progressRouter.get("/", authController.verifyTrainer, controller.findAll);

progressRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeProgress,
  controller.add
);

progressRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeProgress,
  controller.update
);

progressRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeProgress,
  controller.update
);

progressRouter.delete("/:id", authController.verifyTrainer, controller.delete);
