import { Router } from "express";
import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./news.controller.js";

export const newsRouter = Router();

newsRouter.get("/", controller.findAll);
newsRouter.get("/:id", controller.findOne);

newsRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeNews,
  controller.add
);

newsRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeNews,
  controller.update
);

newsRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeNews,
  controller.update
);

newsRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
