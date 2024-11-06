import { Router } from "express";
import { controller } from "./Payment.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const paymentRouter = Router();

paymentRouter.get("/", authController.verifyTrainer, controller.findAll);
paymentRouter.get("/:id", authController.verifyTrainer, controller.findOne);

paymentRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizePayment,
  controller.add
);

paymentRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizePayment,
  controller.update
);

paymentRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizePayment,
  controller.update
);

paymentRouter.delete("/:id", authController.verifyTrainer, controller.delete);
