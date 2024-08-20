import { Router } from "express";
import { controller } from "./Class.controller.js";

export const classRouter = Router();

classRouter.get("/", controller.findAll);
classRouter.get("/:id", controller.findOne);
classRouter.post("/", controller.sanitizeClass, controller.add);
classRouter.put("/:id", controller.sanitizeClass, controller.update);
classRouter.patch("/:id", controller.sanitizeClass, controller.update);
classRouter.delete("/:id", controller.delete);
