import { Request, Response } from "express";
import { ApiResponse } from "../../utils/classes/api-response.class.js";
import { Message } from "./message.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { validateObjectId } from "../../utils/validators/data-type.validators.js";

export const messageController = {
  getMessages: async (req: Request, res: Response) => {
    try {
      const sender = validateObjectId(req.params.sender, "Emisor");
      const receiver = validateObjectId(req.params.receiver, "Receptor");
      const messages = await orm.em.find(
        Message,
        {
          $or: [
            { sender: sender, receiver: receiver },
            { sender: receiver, receiver: sender },
          ],
        },
        { orderBy: { createdAt: "ASC" } }
      );

      return res
        .status(200)
        .json(new ApiResponse("Mensajes Obtenidos", messages));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            "Error obteniendo mensajes no leídos" + error,
            null,
            false
          )
        );
    }
  },

  getUnreadMessages: async (req: Request, res: Response) => {
    try {
      const receiver = validateObjectId(req.params.receiver, "Receptor");

      const unreadMessages = await orm.em.find(
        Message,
        {
          receiver: receiver,
          readAt: undefined,
        },
        { orderBy: { createdAt: "ASC" } }
      );

      return res
        .status(200)
        .json(new ApiResponse("Mensajes no leídos", unreadMessages));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            "Error obteniendo mensajes no leídos" + error,
            null,
            false
          )
        );
    }
  },

  markMessagesAsRead: async (req: Request, res: Response) => {
    try {
      const sender = validateObjectId(req.params.sender, "Emisor");
      const receiver = validateObjectId(req.params.receiver, "Receptor");

      const unreadMessages = await orm.em.find(Message, {
        sender: sender,
        receiver: receiver,
        readAt: undefined,
      });

      for (const message of unreadMessages) {
        message.readAt = new Date();
        orm.em.persist(message);
      }
      await orm.em.flush();

      return res
        .status(200)
        .json(new ApiResponse("Mensajes marcados como leídos"));
    } catch (error) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            "Error obteniendo mensajes no leídos" + error,
            null,
            false
          )
        );
    }
  },
};
