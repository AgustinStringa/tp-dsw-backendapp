import { Client } from "../../modules/client/client/client.entity.js";
import cookie from "cookie";
import { environment } from "../../config/env.config.js";
import IMessageData from "../interfaces/message-data.interface.js";
import jwt from "jsonwebtoken";
import { Message } from "../../modules/chat/message.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { RequestContext } from "@mikro-orm/core";
import { Server } from "socket.io";
import { Trainer } from "../../modules/trainer/trainer/trainer.entity.js";
import { validateEntity } from "../validators/entity.validators.js";
import { validateObjectId } from "../validators/data-type.validators.js";

const MAX_MESSAGE_LENGTH = 150;

export function setupSocket(io: Server) {
  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) throw new Error("No token provided");

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.auth_token;

      if (!token) throw new Error("Unauthorized. No token found.");

      const decoded = jwt.verify(token, environment.session.jwtSecret);
      socket.data.user = decoded;

      next();
    } catch (err) {
      next(new Error("Authentication error" + err));
    }
  });

  io.on("connection", (socket) => {
    socket.on("message", async (data) => {
      try {
        if (data.content.length > MAX_MESSAGE_LENGTH) {
          throw new Error(
            `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres`
          );
        }
        if (!data.content.trim()) {
          throw new Error("El mensaje no puede estar vacío");
        }
        const messageData: IMessageData = data as IMessageData;

        await RequestContext.create(orm.em, async () => {
          try {
            validateObjectId(messageData.receiver, "receiver ID");
            const sender =
              messageData.entity === "client"
                ? await orm.em.findOneOrFail(Client, {
                    id: socket.data.user.id,
                  })
                : await orm.em.findOneOrFail(Trainer, {
                    id: messageData.sender,
                  });

            const receiver =
              messageData.entity === "client"
                ? await orm.em.findOneOrFail(Trainer, {
                    id: messageData.receiver,
                  })
                : await orm.em.findOneOrFail(Client, {
                    id: messageData.receiver,
                  });
            const newMessage = orm.em.create(Message, {
              content: messageData.content,
              createdAt: new Date(),
              sender,
              receiver,
            });

            validateEntity(newMessage);
            await orm.em.persistAndFlush(newMessage);

            io.to(socket.id).emit("respuesta", newMessage);
          } catch (error) {
            console.error("Error al guardar mensaje:", error);
          }
        });
        io.emit("respuesta", messageData);
      } catch (error) {
        console.error("Error en el evento 'message':", error);
      }
    });

    socket.on("disconnect", () => {});
  });
}
