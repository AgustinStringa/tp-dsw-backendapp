import { Router } from "express";
import { controller } from "./Auth.controller.js";

export const authRouter = Router();

authRouter.post("/", controller.sanitizeLogin, controller.login);
//register iría aquí? o en el post de clients/trainer
