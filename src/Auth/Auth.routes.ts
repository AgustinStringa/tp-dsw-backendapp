import { Router } from "express";
import { controller } from "./Auth.controller.js";
export const authRouter = Router();
authRouter.post("/", controller.sanitizeLogin, controller.login);
