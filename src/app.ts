import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { RequestContext } from "@mikro-orm/mongodb";
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

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido:", data);
    io.emit("respuesta", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});

/*
app.listen(PORT, () => {
  console.log("Server runnning on http://localhost:3000/");
});
*/
