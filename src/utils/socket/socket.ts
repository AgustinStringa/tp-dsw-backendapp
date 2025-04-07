import { authService } from "../../modules/auth/auth/auth.service.js";
import { Client } from "../../modules/client/client/client.entity.js";
import IMessageData from "../interfaces/message-data.interface.js";
import { Message } from "../../modules/chat/message.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Server } from "socket.io";
import { Trainer } from "../../modules/trainer/trainer/trainer.entity.js";
import { validateObjectId } from "../validators/data-type.validators.js";

const MAX_MESSAGE_LENGTH = 150;
const em = orm.em.fork();
const socketSessionsMap = new Map<string, string>(); // socket.id -> userId

export function setupSocket(io: Server) {
  io.use(async (socket, next) => {
    try {
      const userId = (
        await authService.decodeTokenFromWebsocket(
          socket.handshake.headers.cookie
        )
      ).user.id;

      socketSessionsMap.set(socket.id, userId);

      next();
    } catch (err) {
      next(new Error("Authentication error" + err));
    }
  });

  io.on("connection", (socket) => {
    socket.on("message", async (data) => {
      try {
        const messageData: IMessageData = data as IMessageData;

        if (messageData.content.length > MAX_MESSAGE_LENGTH) {
          throw new Error(
            `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres.`
          );
        }
        if (!messageData.content.trim()) {
          throw new Error("El mensaje no puede estar vacío.");
        }

        validateObjectId(messageData.receiver, "receiver");

        let receiver: Trainer | Client | null;
        receiver = await em.findOne(Trainer, {
          id: messageData.receiver,
        });

        if (!receiver) {
          receiver = await em.findOneOrFail(Client, {
            id: messageData.receiver,
          });
        }

        const sender = socketSessionsMap.get(socket.id);
        const receiverSocketId = findSocketIdByUserId(receiver.id);

        if (!sender) throw new Error("No se encontró al usuario.");

        const newMessage = em.create(Message, {
          content: messageData.content,
          createdAt: new Date(),
          sender,
          receiver,
        });

        await em.flush();

        io.to(socket.id).emit("message-sent", newMessage);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message-received", newMessage);
        }
      } catch (error) {
        console.log(error);
        io.emit("error", error);
      }
    });

    socket.on("disconnect", () => {
      socketSessionsMap.delete(socket.id);
    });
  });
}

function findSocketIdByUserId(receiverId: string): string | undefined {
  for (const [socketId, userId] of socketSessionsMap.entries()) {
    if (userId === receiverId) {
      return socketId;
    }
  }
  return undefined;
}
