import { Client } from "../../modules/client/client/client.entity.js";
import cookie from "cookie";
import { environment } from "../../config/env.config.js";
import IMessageData from "../interfaces/messageData.interface.js";
import jwt from "jsonwebtoken";
import { Message } from "../../modules/chat/message.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { RequestContext } from "@mikro-orm/core";
import { Server } from "socket.io";
import { Trainer } from "../../modules/trainer/trainer/trainer.entity.js";

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
      const messageData: IMessageData = data as IMessageData;

      RequestContext.create(orm.em, async () => {
        try {
          const newMessage = new Message();
          newMessage.content = messageData.content;
          newMessage.createdAt = new Date();
          const id = messageData.receiver;
          if (messageData.entity === "client") {
            newMessage.sender = await orm.em.findOneOrFail(Client, {
              id: socket.data.user.id,
            });
            newMessage.receiver = await orm.em.findOneOrFail(Trainer, { id });
          } else {
            newMessage.sender = await orm.em.findOneOrFail(Trainer, {
              id: socket.data.user.id,
            });
            newMessage.receiver = await orm.em.findOneOrFail(Client, { id });
          }

          await orm.em.persistAndFlush(newMessage);
        } catch (error) {
          console.error("Error al guardar mensaje:", error);
        }
      });

      io.emit("respuesta", messageData);
    });

    socket.on("disconnect", () => {});
  });
}
