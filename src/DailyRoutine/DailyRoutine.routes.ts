import { Router } from "express";
import { controller } from "./DailyRoutine.controller.js";

export const dailyRoutineRouter = Router();

dailyRoutineRouter.get("/", controller.findAll);
dailyRoutineRouter.get("/:id", controller.findOne);
dailyRoutineRouter.post("/", controller.sanitizeDailyRoutine, controller.add);
dailyRoutineRouter.put(
  "/:id",
  controller.sanitizeDailyRoutine,
  controller.update
);
dailyRoutineRouter.patch(
  "/:id",
  controller.sanitizeDailyRoutine,
  controller.update
);
dailyRoutineRouter.delete("/:id", controller.delete);
