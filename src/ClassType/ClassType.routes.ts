import { Router } from "express";
import { controller } from "./ClassType.controller.js";
import { sanitizeClassType } from "../shared/sanitizeClassType.js";

export const classtypeRouter = Router();

classtypeRouter.get("/", controller.findAll);
classtypeRouter.get("/:id", controller.findOne);
classtypeRouter.post("/", sanitizeClassType, controller.add);
classtypeRouter.put("/:id", sanitizeClassType, controller.update);
classtypeRouter.patch("/:id", sanitizeClassType, controller.update);
classtypeRouter.delete("/:id", controller.remove);
