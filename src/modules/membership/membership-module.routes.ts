import { Router } from "express";
import { membershipRouter } from "./membership/membership.routes.js";
import { membershipTypeRouter } from "./membership-type/membership-type.routes.js";
import { paymentRouter } from "./payment/payment.routes.js";

export const membershipsRouter = Router();

membershipsRouter.use("/types", membershipTypeRouter);
membershipsRouter.use("/payments", paymentRouter);
membershipsRouter.use("/", membershipRouter);
