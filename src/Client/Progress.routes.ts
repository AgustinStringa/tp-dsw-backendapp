import { Router } from "express";
import { controller } from "./Progress.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const progressRouter = Router();

progressRouter.get("/:id", authController.verifyClient, controller.findOne);
progressRouter.get("/", authController.verifyClient, controller.findAll);
progressRouter.get(
  "/client/:id",
  authController.verifyClient,
  controller.findByClient
);

progressRouter.post(
  "/",
  authController.verifyClient,
  controller.sanitizeProgress,
  controller.add
);

progressRouter.put(
  "/:id",
  authController.verifyClient,
  controller.sanitizeProgress,
  controller.update
);

progressRouter.patch(
  "/:id",
  authController.verifyClient,
  controller.sanitizeProgress,
  controller.update
);

progressRouter.delete("/:id", authController.verifyClient, controller.delete);
