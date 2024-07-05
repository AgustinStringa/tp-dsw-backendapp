import express from "express";
import { controller } from "./Excercise.controller.js";

const excerciseRouter = express.Router();

excerciseRouter.get("/:id", controller.findOne);
excerciseRouter.get("/", controller.findAll);
excerciseRouter.post("/", controller.sanitizeExcercise, controller.add);
excerciseRouter.put("/:id", controller.sanitizeExcercise, controller.update);
excerciseRouter.patch("/:id", controller.sanitizeExcercise, controller.update);
excerciseRouter.delete("/:id", controller.delete);

export { excerciseRouter };
