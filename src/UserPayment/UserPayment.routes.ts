import { Router } from "express";
import { controller } from "./UserPayment.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const userPaymentRouter = Router();

userPaymentRouter.post(
  "/",
  authController.verifyClient,
  controller.sanitizeRequest,
  controller.initiatePayment
);

userPaymentRouter.post(
  "/webhook" /*bodyParser.raw({type: 'application/json'}),*/,
  controller.handleWebhook
);

//TODO reembolsos, pagos cancelados??
