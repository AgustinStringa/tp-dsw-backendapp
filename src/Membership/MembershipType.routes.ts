import Router from "express";
import { controller } from "./MembershipType.controller.js";

export const membershipTypeRouter = Router();

membershipTypeRouter.get("/:id", controller.findOne);
membershipTypeRouter.get("/", controller.findAll);
membershipTypeRouter.post(
  "/",
  controller.sanitizeMembershipType,
  controller.add
);
membershipTypeRouter.put(
  "/:id",
  controller.sanitizeMembershipType,
  controller.update
);
membershipTypeRouter.patch(
  "/:id",
  controller.sanitizeMembershipType,
  controller.update
);
membershipTypeRouter.delete("/:id", controller.delete);
