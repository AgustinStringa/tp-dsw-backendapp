import { Router } from "express";
import { controller } from "./Client.controller.js";
import { sanitizeClient } from "../shared/sanitizeClient.js";

export const clientRouter = Router();

clientRouter.get('/', controller.findAll);
clientRouter.get('/:id', controller.findOne);
clientRouter.post('/', sanitizeClient, controller.add);
clientRouter.put('/:id', sanitizeClient, controller.update);
clientRouter.patch('/:id', sanitizeClient, controller.update);
clientRouter.delete('/:id', controller.remove);