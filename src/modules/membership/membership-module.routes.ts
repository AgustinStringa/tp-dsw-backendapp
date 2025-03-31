import {
  paymentByMembershipRouter,
  paymentRouter,
} from "./payment/payment.routes.js";
import { membershipRouter } from "./membership/membership.routes.js";
import { membershipTypeRouter } from "./membership-type/membership-type.routes.js";
import { Router } from "express";

export const membershipsRouter = Router();

membershipsRouter.use("/types", membershipTypeRouter);
membershipsRouter.use("/payments", paymentRouter);
membershipsRouter.use("/:membershipId/payments", paymentByMembershipRouter);
membershipsRouter.use("/", membershipRouter);
