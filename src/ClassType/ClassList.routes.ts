import { Router } from "express";
import { controller } from "./ClassList.controller.js";

export const classListRouter = Router();

classListRouter.get("/", controller.findAll);
classListRouter.get("/:id", controller.findOne);
classListRouter.post("/", controller.sanitizeClassList, controller.add);
classListRouter.put("/:id", controller.sanitizeClassList, controller.update);
classListRouter.patch("/:id", controller.sanitizeClassList, controller.update);
classListRouter.delete("/:id", controller.delete);
