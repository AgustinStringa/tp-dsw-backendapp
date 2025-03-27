import { Request, Response } from "express";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Message } from "./message.entity.js";
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

      return res.status(200).json({ data: messages });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ message: "Error obteniendo mensajes" });
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

      return res.status(200).json({ data: unreadMessages });
    } catch (error) {
      console.error("Error al obtener mensajes no leídos:", error);
      return res
        .status(500)
        .json({ message: "Error obteniendo mensajes no leídos" });
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

      return res.status(200).json({ message: "Mensajes marcados como leídos" });
    } catch (error) {
      console.error("Error al marcar mensajes como leídos:", error);
      return res
        .status(500)
        .json({ message: "Error marcando mensajes como leídos" });
    }
  },
};
