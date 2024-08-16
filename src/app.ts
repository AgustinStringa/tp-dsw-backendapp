import "reflect-metadata";
import express from "express";
import { RequestContext } from "@mikro-orm/mongodb";
import { orm } from "./shared/db/mikro-orm.config.js";
import { clientRouter } from "./Client/Client.routes.js";
import { membershipTypeRouter } from "./Membership/MembershipType.routes.js";
import { trainerRouter } from "./Trainer/Trainer.routes.js";
import { classTypeRouter } from "./ClassType/ClassType.routes.js";
import { exerciseRouter } from "./Routine/Exercise.routes.js";
import { exerciseRoutineRouter } from "./Routine/ExerciseRoutine.routes.js";
import { routineRouter } from "./Routine/Routine.routes.js";
import { currentMembershipRouter } from "./Membership/CurrentMembership.routes.js";
import { paymentRouter } from "./Membership/Payment.routes.js";
import { classListRouter } from "./ClassType/ClassList.routes.js";
import { authRouter } from "./Auth/Auth.routes.js";
import cors from "cors";

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

app.use("/api/membershiptypes", membershipTypeRouter);
app.use("/api/currentmemberships", currentMembershipRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/clients", clientRouter);
app.use("/api/classtypes", classTypeRouter);
app.use("/api/trainers", trainerRouter);
app.use("/api/exercises", exerciseRouter);
app.use("/api/exercisesRoutine", exerciseRoutineRouter);
app.use("/api/routines", routineRouter);
app.use("/api/classLists", classListRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log("Server runnning on http://localhost:3000/");
});
