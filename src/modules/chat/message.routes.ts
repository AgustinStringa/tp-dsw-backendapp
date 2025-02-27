import { Router } from "express";
import { messageController } from "./message.controler.js";
import { authMiddlewares } from "../auth/auth/auth.middlewares.js";

export const messageRouter = Router();

messageRouter.get(
  "/trainer/:trainerId",
  authMiddlewares.verifyTrainer,
  messageController.getMessagesForTrainer
);
messageRouter.get(
  "/client/:clientId",
  authMiddlewares.verifyClient,
  messageController.getMessageFromClient
);
