import { clientRouter } from "./Client/Client.routes.js";
import { membershipType_router } from "./MembershipType/MembershipType.routes.js";
import express from "express";
import { Trainers_router } from "./Trainers/Trainers.routes.js";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use("/api/membershiptypes", membershipType_router);
app.use("/api/clients", clientRouter);


app.use("/api/trainers", Trainers_router);


app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});

app.listen(PORT, () => {
  console.log("Server runnning on http://localhost:3000/");
});
