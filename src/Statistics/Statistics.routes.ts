import { Router } from "express";
import { controller } from "./Statistics.controller.js";

export const statisticsRouter = Router();

statisticsRouter.get("/", controller.calculateStatistics);
//statisticsRouter.get("/:month", controller.calculateStatisticsMonth);
