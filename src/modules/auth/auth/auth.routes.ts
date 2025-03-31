import { controller } from "./auth.controller.js";
import { Router } from "express";

export const authRouter = Router();

authRouter.post("/", controller.sanitizeLogin, controller.login);
authRouter.post("/logout/", controller.logout);
authRouter.post("/refresh/", controller.refresh);
