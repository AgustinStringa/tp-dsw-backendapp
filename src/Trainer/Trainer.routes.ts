import express from "express";
import { controller } from "./Trainer.controller.js";
import { controller as authController } from "../Auth/Auth.controller.js";
const trainerRouter = express.Router();

trainerRouter.get("/:id", controller.findOne);
trainerRouter.get("/", authController.verifyTrainer, controller.findAll);
trainerRouter.post("/", controller.sanitizeTrainer, controller.add);
trainerRouter.put("/:id", controller.sanitizeTrainer, controller.update);
trainerRouter.patch("/:id", controller.sanitizeTrainer, controller.update);
trainerRouter.delete("/:id", controller.delete);

export { trainerRouter };
