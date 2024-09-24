import { Router } from "express";
import { controller } from "./Routine.controller.js";

export const routineRouter = Router();

routineRouter.get("/", controller.findAll);
routineRouter.get("/:id", controller.findOne);
routineRouter.post("/", controller.sanitizeRoutine, controller.add);
routineRouter.put("/:id", controller.sanitizeRoutine, controller.update);
routineRouter.patch("/:id", controller.sanitizeRoutine, controller.update);
routineRouter.delete("/:id", controller.delete);
routineRouter.get("/:userId/current", controller.findCurrentRoutine);
