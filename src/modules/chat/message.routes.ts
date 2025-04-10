import { authMiddlewares } from "../auth/auth/auth.middlewares.js";
import { messageController } from "./message.controller.js";
import { Router } from "express";

export const messageRouter = Router();

/**
 * @swagger
 * /api/messages/recipients:
 *   get:
 *     summary: Obtener lista de destinatarios para el usuario autenticado
 *     operationId: getMessageRecipients
 *     tags:
 *       - Mensajes
 *     responses:
 *       200:
 *         description: Lista de destinatarios obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
messageRouter.get(
  "/recipients",
  authMiddlewares.verifyUser,
  messageController.getRecipients
);

/**
 * @swagger
 * /api/messages/unread:
 *   get:
 *     summary: Obtener mensajes no leídos del usuario autenticado
 *     operationId: getUnreadMessages
 *     tags:
 *       - Mensajes
 *     responses:
 *       200:
 *         description: Mensajes no leídos obtenidos exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
messageRouter.get(
  "/unread",
  authMiddlewares.verifyUser,
  messageController.getUnreadMessages
);

/**
 * @swagger
 * /api/messages/user/{userId}:
 *   get:
 *     summary: Obtener mensajes entre el usuario autenticado y otro usuario
 *     operationId: getMessagesWithUser
 *     tags:
 *       - Mensajes
 *     responses:
 *       200:
 *         description: Lista de mensajes obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
messageRouter.get(
  "/user/:userId",
  authMiddlewares.verifyUser,
  messageController.getMessagesWithUser
);

/**
 * @swagger
 * /api/messages/user/{userId}/mark-as-read:
 *   patch:
 *     summary: Marcar como leídos los mensajes de un usuario
 *     operationId: markMessagesAsRead
 *     tags:
 *       - Mensajes
 *     responses:
 *       200:
 *         description: Mensajes marcados como leídos exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
messageRouter.patch(
  "/user/:userId/mark-as-read",
  authMiddlewares.verifyUser,
  messageController.markMessagesAsRead
);
