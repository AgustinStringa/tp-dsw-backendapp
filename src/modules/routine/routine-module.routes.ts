import {
  routineByClientRouter,
  routineRouter,
} from "./routine/routine.routes.js";
import { exerciseRouter } from "./exercise/exercise.routes.js";
import { exerciseRoutineRouter } from "./exercise-routine/exercise-routine.routes.js";
import { Router } from "express";

export const routinesRouter = Router();

routinesRouter.use("/exercises", exerciseRouter);
routinesRouter.use("/exerciseroutines", exerciseRoutineRouter);
routinesRouter.use("/clients/:clientId", routineByClientRouter);
routinesRouter.use("/", routineRouter);
