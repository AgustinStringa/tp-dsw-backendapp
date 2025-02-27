import { Request, Response } from "express";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Message } from "./message.entity.js";

export const messageController = {
  getMessagesForTrainer: async (req: Request, res: Response) => {
    try {
      const trainerId = req.params.trainerId;
      console.log("Buscando mensajes para el entrenador:", trainerId);

      const messages = await orm.em.find(
        Message,
        { trainer: trainerId },
        { orderBy: { createdAt: "ASC" } }
      );

      console.log("Mensajes encontrados:", messages);
      return res.status(200).json({ data: messages });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ message: "Error obteniendo mensajes" });
    }
  },

  getMessageFromClient: async (req: Request, res: Response) => {
    try {
      const clientId = req.params.clientId;
      console.log("Buscando mensajes para el cliente:", clientId);

      const messages = await orm.em.find(
        Message,
        { client: clientId },
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
