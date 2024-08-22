import { Router } from "express";
import { classRouter } from "./Class.routes.js";
import { classTypeRouter } from "./ClassType.routes.js";
import { registrationRouter } from "./Registration.routes.js";

export const classesRouter = Router();

classesRouter.use("/registration", registrationRouter);
classesRouter.use("/types", classTypeRouter);
classesRouter.use("/", classRouter);
