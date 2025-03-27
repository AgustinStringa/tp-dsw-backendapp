import { clientRouter } from "./client/client.routes.js";
import { goalRouter } from "./goal/goal.routes.js";
import { progressRouter } from "./progress/progress.routes.js";
import { Router } from "express";

export const clientsRouter = Router();

clientsRouter.use("/goals", goalRouter);
clientsRouter.use("/progresses", progressRouter);
clientsRouter.use("/", clientRouter);
