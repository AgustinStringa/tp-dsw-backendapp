import { Router } from "express";
import { controller } from "./ExcerciseRoutine.controller.js";

export const excerciseRoutineRouter = Router();

excerciseRoutineRouter.get("/", controller.findAll);
excerciseRoutineRouter.get("/:id", controller.findOne);
excerciseRoutineRouter.post(
  "/",
  controller.sanitizeExcerciseRoutine,
  controller.add
);
excerciseRoutineRouter.put(
  "/:id",
  controller.sanitizeExcerciseRoutine,
  controller.update
);
excerciseRoutineRouter.patch(
  "/:id",
  controller.sanitizeExcerciseRoutine,
  controller.update
);
excerciseRoutineRouter.delete("/:id", controller.delete);
