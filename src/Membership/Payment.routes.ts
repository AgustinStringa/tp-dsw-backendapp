import { Router } from "express";
import { controller } from "./Payment.controller.js";

export const paymentRouter = Router();

paymentRouter.get("/", controller.findAll);
paymentRouter.get("/:id", controller.findOne);
paymentRouter.post("/", controller.sanitizePayment, controller.add);
paymentRouter.put("/:id", controller.sanitizePayment, controller.update);
paymentRouter.patch("/:id", controller.sanitizePayment, controller.update);
paymentRouter.delete("/:id", controller.delete);
