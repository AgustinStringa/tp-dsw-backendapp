import { Router } from "express";
import { controller } from "./MonthlyRoutine.controller.js";

export const monthlyRoutineRouter = Router();

monthlyRoutineRouter.get("/", controller.findAll);
monthlyRoutineRouter.get("/:id", controller.findOne);
monthlyRoutineRouter.post(
  "/",
  controller.sanitizeMonthlyRoutine,
  controller.add
);
monthlyRoutineRouter.put(
  "/:id",
  controller.sanitizeMonthlyRoutine,
  controller.update
);
monthlyRoutineRouter.patch(
  "/:id",
  controller.sanitizeMonthlyRoutine,
  controller.update
);
monthlyRoutineRouter.delete("/:id", controller.delete);
