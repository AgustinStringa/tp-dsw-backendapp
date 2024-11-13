import { Router } from "express";
import { controller } from "./Auth.controller.js";

export const authRouter = Router();

authRouter.post("/", controller.sanitizeLogin, controller.login);
authRouter.post("/logout/", controller.logout);
authRouter.post("/refresh/", controller.refresh);
