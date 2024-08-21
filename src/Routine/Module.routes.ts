import { Router } from "express";
import { routineRouter } from "./Routine.routes.js";
import { exerciseRouter } from "./Exercise.routes.js";
import { exerciseRoutineRouter } from "./ExerciseRoutine.routes.js";

export const routinesRouter = Router();

routinesRouter.use("/exercises", exerciseRouter);
routinesRouter.use("/exerciseroutines", exerciseRoutineRouter);
routinesRouter.use("/", routineRouter);
