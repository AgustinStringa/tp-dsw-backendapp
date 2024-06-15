import { Router } from "express";
import { controller } from "./Progress.controller.js";

export const progressRouter = Router();

progressRouter.get("/", controller.findAll);
progressRouter.get("/:id", controller.findOne);
progressRouter.post("/", controller.sanitizeProgress, controller.add);
progressRouter.put("/:id", controller.sanitizeProgress, controller.update);
progressRouter.patch("/:id", controller.sanitizeProgress, controller.update);
progressRouter.delete("/:id", controller.remove);
