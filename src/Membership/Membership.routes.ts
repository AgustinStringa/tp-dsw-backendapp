import { Router } from "express";
import { controller } from "./Membership.controller.js";

export const membershipRouter = Router();

membershipRouter.get("/:id", controller.findOne);
membershipRouter.get("/", controller.findAll);
membershipRouter.post("/", controller.sanitizeMembership, controller.add);

membershipRouter.put("/:id", controller.sanitizeMembership, controller.update);

membershipRouter.patch(
  "/:id",
  controller.sanitizeMembership,
  controller.update
);

membershipRouter.delete("/:id", controller.delete);
