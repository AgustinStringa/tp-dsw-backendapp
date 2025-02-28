import { Request, Response } from "express";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Message } from "./message.entity.js";

export const messageController = {
  getMessages: async (req: Request, res: Response) => {
    try {
      const sender = req.params.sender;
      const receiver = req.params.receiver;
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
};
