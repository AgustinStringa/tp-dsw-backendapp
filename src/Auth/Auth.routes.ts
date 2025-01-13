import { Router } from "express";
import { controller } from "./Auth.controller.js";

export const authRouter = Router();

authRouter.post("/", controller.sanitizeLogin, controller.login);
authRouter.post("/logout/", controller.logout);
authRouter.get(
  "/request-change-password/",
  controller.verifyUser,
  controller.sendEmailChangePassword
);
authRouter.post("/refresh/", controller.refresh);
