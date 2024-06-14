import { Router } from "express";
import { controller } from "./Client.controller.js";

export const clientRouter = Router();

clientRouter.get("/", controller.findAll);
clientRouter.get("/:id", controller.findOne);
clientRouter.post("/", controller.sanitizeClient, controller.add);
clientRouter.put("/:id", controller.sanitizeClient, controller.update);
clientRouter.patch("/:id", controller.sanitizeClient, controller.update);
clientRouter.delete("/:id", controller.remove);
