import { Router } from "express";
import { controller } from "./ClassAssign.controller.js";

export const classAssignRouter = Router();

classAssignRouter.get("/", controller.findAll);