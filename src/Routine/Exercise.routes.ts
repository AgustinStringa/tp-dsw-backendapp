import express from "express";
import { controller } from "./Exercise.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";
const exerciseRouter = express.Router();

exerciseRouter.get("/:id", authController.verifyTrainer, controller.findOne);
exerciseRouter.get("/", authController.verifyTrainer, controller.findAll); //trainer
exerciseRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeExercise,
  controller.add
);
exerciseRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);
exerciseRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);
exerciseRouter.delete("/:id", authController.verifyTrainer, controller.delete);

export { exerciseRouter };
