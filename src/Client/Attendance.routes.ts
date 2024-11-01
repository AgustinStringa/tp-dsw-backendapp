import { Router } from "express";
import { controller } from "./Attendance.controller.js";

export const attendanceRouter = Router();

// TODO: Será necesario estar logueado como entrenador para acceder al endpoint
attendanceRouter.post("/", controller.sanitizeAttendance, controller.add);
