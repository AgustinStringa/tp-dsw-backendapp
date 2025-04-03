import { goalByClientRouter, goalRouter } from "./goal/goal.routes.js";
import {
  progressByClientRouter,
  progressRouter,
} from "./progress/progress.routes.js";
import { authMiddlewares } from "../auth/auth/auth.middlewares.js";
import { clientRouter } from "./client/client.routes.js";
import { controller as homeController } from "../home/home.controller.js";
import { Router } from "express";

export const clientsRouter = Router();

clientsRouter.use("/goals", goalRouter);
clientsRouter.use("/:clientId/goals", goalByClientRouter);

clientsRouter.use("/progresses", progressRouter);
clientsRouter.use("/:clientId/progresses", progressByClientRouter);

clientsRouter.use(
  "/home",
  authMiddlewares.verifyClient,
  homeController.getDataForClient
);

clientsRouter.use("/", clientRouter);
