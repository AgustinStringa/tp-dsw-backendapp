import { Router } from "express";
import { controller } from "./Registration.controller.js";

export const registrationRouter = Router();

registrationRouter.get("/", controller.findAll);
registrationRouter.get("/:id", controller.findOne);
registrationRouter.post("/", controller.sanitizeRegistration, controller.add);
registrationRouter.put(
  "/:id",
  controller.sanitizeRegistration,
  controller.update
);
registrationRouter.patch(
  "/:id",
  controller.sanitizeRegistration,
  controller.update
);
registrationRouter.delete("/:id", controller.delete);
