import { goalByClientRouter, goalRouter } from "./goal/goal.routes.js";
import {
  progressByClientRouter,
  progressRouter,
} from "./progress/progress.routes.js";
import { clientRouter } from "./client/client.routes.js";
import { Router } from "express";

export const clientsRouter = Router();

clientsRouter.use("/goals", goalRouter);
clientsRouter.use("/:clientId/goals", goalByClientRouter);
clientsRouter.use("/progresses", progressRouter);
clientsRouter.use("/:clientId/progresses", progressByClientRouter);
clientsRouter.use("/", clientRouter);
