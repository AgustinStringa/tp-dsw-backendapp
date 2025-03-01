import { Router } from "express";
import { messageController } from "./message.controler.js";
import { authMiddlewares } from "../auth/auth/auth.middlewares.js";

export const messageRouter = Router();

messageRouter.get(
  "/:receiver/:sender",
  authMiddlewares.verifyUser,
  messageController.getMessages
);
messageRouter.post(
  "/unread/:receiver",
  authMiddlewares.verifyUser,
  messageController.getUnreadMessages
);
messageRouter.post(
  "/mark-as-read/:receiver/:sender",
  authMiddlewares.verifyUser,
  messageController.markMessagesAsRead
);
