import express from "express";
import { sanitizeMembershipType } from "../shared/sanitizeMembershipType.js";
import { controller } from "./MembershipType.controller.js";
const membershipTypeRouter = express.Router();

membershipTypeRouter.get("/:id", controller.findOne);
membershipTypeRouter.get("/", controller.findAll);

membershipTypeRouter.post("/", sanitizeMembershipType, controller.add);

membershipTypeRouter.put("/:id", sanitizeMembershipType, controller.update);

membershipTypeRouter.patch("/:id", sanitizeMembershipType, controller.update);

membershipTypeRouter.delete("/:id", controller.delete);

export { membershipTypeRouter };
