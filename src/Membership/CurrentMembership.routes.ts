import Router from "express";
import { controller } from "./CurrentMembership.controller.js";

export const currentMembershipRouter = Router();

currentMembershipRouter.get("/:id", controller.findOne);
currentMembershipRouter.get("/", controller.findAll);
currentMembershipRouter.post(
  "/",
  controller.sanitizeCurrentMembership,
  controller.add
);

currentMembershipRouter.put(
  "/:id",
  controller.sanitizeCurrentMembership,
  controller.update
);

currentMembershipRouter.patch(
  "/:id",
  controller.sanitizeCurrentMembership,
  controller.update
);

currentMembershipRouter.delete("/:id", controller.delete);
