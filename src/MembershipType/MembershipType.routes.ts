import express from "express";
import { sanitizeMembershipType } from "../shared/sanitizeMembershipType.js";
import { controller } from "./MembershipType.controller.js";
const membershipType_router = express.Router();

membershipType_router.get("/:id", controller.findOne);
membershipType_router.get("/", controller.findAll);

membershipType_router.post("/", sanitizeMembershipType, controller.add);

membershipType_router.put("/:id", sanitizeMembershipType, controller.update);

membershipType_router.patch("/:id", sanitizeMembershipType, controller.update);

membershipType_router.delete("/:id", controller.delete);

export { membershipType_router };
