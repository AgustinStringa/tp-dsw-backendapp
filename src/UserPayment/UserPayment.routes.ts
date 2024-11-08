import { Router } from "express";
import { controller } from "./UserPayment.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const userPaymentRouter = Router();

userPaymentRouter.post("/:id", authController.verifyClient, controller.add);
