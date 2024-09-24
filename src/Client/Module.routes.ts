import { Router } from "express";
import { goalRouter } from "./Goal.routes.js";
import { progressRouter } from "./Progress.routes.js";
import { clientRouter } from "./Client.routes.js";

export const clientsRouter = Router();

clientsRouter.use("/goals", goalRouter);
clientsRouter.use("/progresses", progressRouter);
clientsRouter.use("/", clientRouter);
