import express from "express";
import { sanitizeTrainers } from "../shared/sanitizeTrainers.js";
import { controller } from "./Trainers.controller.js";
const Trainers_router = express.Router();

Trainers_router.get("/:id", controller.findOne);
Trainers_router.get("/", controller.findAll);

Trainers_router.post("/", sanitizeTrainers, controller.add);

Trainers_router.put("/:id", sanitizeTrainers, controller.update);

Trainers_router.patch("/:id", sanitizeTrainers, controller.update);

Trainers_router.delete("/:id", controller.delete);

export { Trainers_router };
