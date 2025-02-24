import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./payment.controller.js";

export const paymentRouter = Router();

paymentRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);
paymentRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

paymentRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizePayment,
  controller.add
);

paymentRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizePayment,
  controller.update
);

paymentRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizePayment,
  controller.update
);

paymentRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
