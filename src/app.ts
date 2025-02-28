import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { RequestContext } from "@mikro-orm/mongodb";
import cookie from "cookie";
import { authRouter } from "./modules/auth/auth/auth.routes.js";
import { classesRouter } from "./modules/class/class-module.routes.js";
import { clientsRouter } from "./modules/client/client-module.routes.js";
import { membershipsRouter } from "./modules/membership/membership-module.routes.js";
import { newsRouter } from "./modules/news/news/news.routes.js";
import { orm } from "./config/db/mikro-orm.config.js";
import { routinesRouter } from "./modules/routine/routine-module.routes.js";
import { trainerRouter } from "./modules/trainer/trainer/trainer.routes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { environment } from "./config/env.config.js";
import { Message } from "./modules/chat/message.entity.js";
import { Client } from "./modules/client/client/client.entity.js";
import { Trainer } from "./modules/trainer/trainer/trainer.entity.js";
import { messageRouter } from "./modules/chat/message.routes.js";

const PORT = 3000;
const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use(
  cors({
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/classes", classesRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/memberships", membershipsRouter);
app.use("/api/news", newsRouter);
app.use("/api/routines", routinesRouter);
app.use("/api/trainers", trainerRouter);
app.use("/api/messages", messageRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

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
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  socket.on("message", async (data) => {
    const messageData = JSON.parse(data);
    console.log(`Mensaje de ${socket.data.user.id}:`, messageData);

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

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});

/*
app.listen(PORT, () => {
  console.log("Server runnning on http://localhost:3000/");
});
*/
