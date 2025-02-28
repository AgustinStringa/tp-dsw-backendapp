import { Request, Response } from "express";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Message } from "./message.entity.js";

export const messageController = {
  getMessagesForTrainer: async (req: Request, res: Response) => {
    try {
      const receiver = req.params.userId;
      console.log("Buscando mensajes para el entrenador:", receiver);

      const messages = await orm.em.find(
        Message,
        { receiver: receiver },
        { orderBy: { createdAt: "ASC" } }
      );

      console.log("Mensajes encontrados:", messages);
      return res.status(200).json({ data: messages });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ message: "Error obteniendo mensajes" });
    }
  },

  getMessages: async (req: Request, res: Response) => {
    try {
      const sender = req.params.sender;
      const receiver = req.params.receiver;
      console.log("Buscando mensajes para :", receiver);
      console.log("Buscando mensajes de:", sender);

      const messages = await orm.em.find(
        Message,
        { sender: sender, receiver: receiver },
        { orderBy: { createdAt: "ASC" } }
      );

      console.log("Mensajes encontrados:", messages);
      return res.status(200).json({ data: messages });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ message: "Error obteniendo mensajes" });
    }
  },
};
