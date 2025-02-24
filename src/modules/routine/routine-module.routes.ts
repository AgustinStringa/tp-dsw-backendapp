import { Router } from "express";
import { exerciseRouter } from "./exercise/exercise.routes.js";
import { exerciseRoutineRouter } from "./exercise-routine/exercise-routine.routes.js";
import { routineRouter } from "./routine/routine.routes.js";

export const routinesRouter = Router();

routinesRouter.use("/exercises", exerciseRouter);
routinesRouter.use("/exerciseroutines", exerciseRoutineRouter);
routinesRouter.use("/", routineRouter);
