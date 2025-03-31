import { authMiddlewares } from "../auth/auth/auth.middlewares.js";
import { controller } from "./user-payment.controller.js";
import { Router } from "express";

export const userPaymentRouter = Router();

userPaymentRouter.post(
  "/",
  authMiddlewares.verifyClient,
  controller.sanitizeRequest,
  controller.initiatePayment
);

//TODO reembolsos, pagos cancelados??
