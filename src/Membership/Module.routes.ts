import { Router } from "express";
import { membershipTypeRouter } from "./MembershipType.routes.js";
import { currentMembershipRouter } from "./CurrentMembership.routes.js";
import { paymentRouter } from "./Payment.routes.js";

export const membershipsRouter = Router();

membershipsRouter.use("/currentmemberships", currentMembershipRouter);
membershipsRouter.use("/membershiptypes", membershipTypeRouter);
membershipsRouter.use("/payments", paymentRouter);
