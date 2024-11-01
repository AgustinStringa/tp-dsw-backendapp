import { Router } from "express";
import { attendanceRouter } from "./Attendance.routes.js";
import { clientRouter } from "./Client.routes.js";
import { goalRouter } from "./Goal.routes.js";
import { progressRouter } from "./Progress.routes.js";

export const clientsRouter = Router();

clientsRouter.use("/attendance", attendanceRouter);
clientsRouter.use("/goals", goalRouter);
clientsRouter.use("/progresses", progressRouter);
clientsRouter.use("/", clientRouter);
