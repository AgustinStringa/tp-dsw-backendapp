import { Router } from "express";
import { controller } from "./ClassType.controller.js";
import { sanitizeClassType } from "../shared/sanitizeClassType.js";

export const classTypeRouter = Router();

classTypeRouter.get("/", controller.findAll);
classTypeRouter.get("/:id", controller.findOne);
classTypeRouter.post("/", sanitizeClassType, controller.add);
classTypeRouter.put("/:id", sanitizeClassType, controller.update);
classTypeRouter.patch("/:id", sanitizeClassType, controller.update);
classTypeRouter.delete("/:id", controller.delete);
