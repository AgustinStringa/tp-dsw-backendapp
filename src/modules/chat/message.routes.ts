import { authMiddlewares } from "../auth/auth/auth.middlewares.js";
import { messageController } from "./message.controller.js";
import { Router } from "express";

export const messageRouter = Router();

messageRouter.get(
  "/recipients",
  authMiddlewares.verifyUser,
  messageController.getRecipients
);

messageRouter.get(
  "/unread",
  authMiddlewares.verifyUser,
  messageController.getUnreadMessages
);

messageRouter.get(
  "/user/:userId",
  authMiddlewares.verifyUser,
  messageController.getMessagesWithUser
);

messageRouter.patch(
  "/user/:userId/mark-as-read",
  authMiddlewares.verifyUser,
  messageController.markMessagesAsRead
);
