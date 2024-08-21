import "reflect-metadata";
import express from "express";
import cors from "cors";
import { RequestContext } from "@mikro-orm/mongodb";
import { orm } from "./shared/db/mikro-orm.config.js";
import { trainerRouter } from "./Trainer/Trainer.routes.js";
import { membershipsRouter } from "./Membership/Module.routes.js";
import { classesRouter } from "./Class/Module.routes.js";
import { clientsRouter } from "./Client/Module.routes.js";
import { routinesRouter } from "./Routine/Module.routes.js";

const PORT = 3000;
const app = express();
app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
app.use(
  cors({
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

app.use("/api/classes", classesRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/memberships", membershipsRouter);
app.use("/api/routines", routinesRouter);
app.use("/api/trainers", trainerRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log("Server runnning on http://localhost:3000/");
});
