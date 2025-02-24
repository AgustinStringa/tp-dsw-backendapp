import { Router } from "express";
import { classRouter } from "./class/class.routes.js";
import { classTypeRouter } from "./class-type/class-type.routes.js";
import { registrationRouter } from "./registration/registration.routes.js";

export const classesRouter = Router();

classesRouter.use("/registration", registrationRouter);
classesRouter.use("/types", classTypeRouter);
classesRouter.use("/", classRouter);
