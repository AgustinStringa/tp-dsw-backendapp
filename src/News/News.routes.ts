import { Router } from "express";
import { controller } from "./News.controller.js";

export const newsRouter = Router();

newsRouter.get("/", controller.findAll);
newsRouter.get("/:id", controller.findOne);
newsRouter.post("/", controller.sanitizeNews, controller.add);
newsRouter.put("/:id", controller.sanitizeNews, controller.update);
newsRouter.patch("/:id", controller.sanitizeNews, controller.update);
newsRouter.delete("/:id", controller.delete);
