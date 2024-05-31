import express from "express";
import { sanitizeTrainer } from "../shared/sanitizeTrainer.js";
import { controller } from "./Trainer.controller.js";

const trainerRouter = express.Router();

trainerRouter.get("/:id", controller.findOne);
trainerRouter.get("/", controller.findAll);
trainerRouter.post("/", sanitizeTrainer, controller.add);
trainerRouter.put("/:id", sanitizeTrainer, controller.update);
trainerRouter.patch("/:id", sanitizeTrainer, controller.update);
trainerRouter.delete("/:id", controller.delete);

export { trainerRouter };
