import { Router } from "express";
import { controller } from "./News.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";

export const newsRouter = Router();

newsRouter.get("/", controller.findAll);
newsRouter.get("/:id", controller.findOne);

newsRouter.post(
  "/",
  authController.verifyTrainer,
  controller.sanitizeNews,
  controller.add
);

newsRouter.put(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeNews,
  controller.update
);

newsRouter.patch(
  "/:id",
  authController.verifyTrainer,
  controller.sanitizeNews,
  controller.update
);

newsRouter.delete("/:id", authController.verifyTrainer, controller.delete);
