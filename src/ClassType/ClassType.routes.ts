import { Router } from "express";
import { controller } from "./ClassType.controller.js";

export const classTypeRouter = Router();

classTypeRouter.get("/", controller.findAll);
classTypeRouter.get("/:id", controller.findOne);
classTypeRouter.post("/", controller.sanitizeClassType, controller.add);
classTypeRouter.put("/:id", controller.sanitizeClassType, controller.update);
classTypeRouter.patch("/:id", controller.sanitizeClassType, controller.update);
classTypeRouter.delete("/:id", controller.delete);
