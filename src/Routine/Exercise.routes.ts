import express from "express";
import { controller } from "./Exercise.controller.js";

const exerciseRouter = express.Router();

exerciseRouter.get("/:id", controller.findOne);
exerciseRouter.get("/", controller.findAll);
exerciseRouter.post("/", controller.sanitizeExercise, controller.add);
exerciseRouter.put("/:id", controller.sanitizeExercise, controller.update);
exerciseRouter.patch("/:id", controller.sanitizeExercise, controller.update);
exerciseRouter.delete("/:id", controller.delete);

export { exerciseRouter };
