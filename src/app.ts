import "reflect-metadata";
import { authRouter } from "./modules/auth/auth/auth.routes.js";
import bodyParser from "body-parser";
import { classesRouter } from "./modules/class/class-module.routes.js";
import { clientsRouter } from "./modules/client/client-module.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { environment } from "./config/env.config.js";
import express from "express";
import { membershipsRouter } from "./modules/membership/membership-module.routes.js";
import { messageRouter } from "./modules/chat/message.routes.js";
import { newsRouter } from "./modules/news/news/news.routes.js";
import { orm } from "./config/db/mikro-orm.config.js";
import { RequestContext } from "@mikro-orm/mongodb";
import { routinesRouter } from "./modules/routine/routine-module.routes.js";
import { Server } from "socket.io";
import { setupSocket } from "./utils/socket/socket.js";
import { trainerRouter } from "./modules/trainer/trainer/trainer.routes.js";
import { controller as userPaymentController } from "./modules/user-payment/user-payment.controller.js";
import { userPaymentRouter } from "./modules/user-payment/user-payment.routes.js";

export const app = express();

export const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: environment.systemUrls.frontendUrl,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

app.use(
  cors({
    origin: environment.systemUrls.frontendUrl,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  userPaymentController.handleWebhook
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/classes", classesRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/memberships", membershipsRouter);
app.use("/api/messages", messageRouter);
app.use("/api/news", newsRouter);
app.use("/api/routines", routinesRouter);
app.use("/api/trainers", trainerRouter);
app.use("/api/user-payment", userPaymentRouter);

app.use((_req, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

setupSocket(io);

server.listen(environment.systemUrls.port, () => {
  console.log(
    `Servidor corriendo en ${environment.systemUrls.backendUrl}:${environment.systemUrls.port}/`
  );
});
