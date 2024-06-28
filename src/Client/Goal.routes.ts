import { Router } from "express";
import { controller } from "./Goal.controller.js";

export const goalRouter = Router();

goalRouter.get("/", controller.findAll);
goalRouter.get("/:id", controller.findOne);
goalRouter.post("/", controller.sanitizeGoal, controller.add);
goalRouter.put("/:id", controller.sanitizeGoal, controller.update);
goalRouter.patch("/:id", controller.sanitizeGoal, controller.update);
goalRouter.delete("/:id", controller.delete);
