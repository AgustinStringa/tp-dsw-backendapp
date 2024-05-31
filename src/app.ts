import express from "express";
import { clientRouter } from "./Client/Client.routes.js";
import { membershipTypeRouter } from "./MembershipType/MembershipType.routes.js";
import { trainerRouter } from "./Trainer/Trainer.routes.js";
import { classTypeRouter } from "./ClassType/ClassType.routes.js";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/api/membershiptypes", membershipTypeRouter);
app.use("/api/clients", clientRouter);
app.use("/api/classtypes", classTypeRouter);
app.use("/api/trainers", trainerRouter);

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log("Server runnning on http://localhost:3000/");
});
