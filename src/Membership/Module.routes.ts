import { Router } from "express";
import { membershipRouter } from "./Membership.routes.js";
import { membershipTypeRouter } from "./MembershipType.routes.js";
import { paymentRouter } from "./Payment.routes.js";

export const membershipsRouter = Router();

membershipsRouter.use("/types", membershipTypeRouter);
membershipsRouter.use("/payments", paymentRouter);
membershipsRouter.use("/", membershipRouter);
