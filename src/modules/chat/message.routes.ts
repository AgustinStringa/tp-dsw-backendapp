import { Router } from "express";
import { messageController } from "./message.controler.js";
import { authMiddlewares } from "../auth/auth/auth.middlewares.js";

export const messageRouter = Router();

messageRouter.get(
  "/:receiver/:sender",
  authMiddlewares.verifyUser,
  messageController.getMessages
);
