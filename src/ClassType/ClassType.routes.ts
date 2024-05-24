import { Router } from "express";
import { add, findAll, findOne, remove, update } from "./ClassType.controller.js";
import { sanitizeClassType } from "../shared/sanitizeClassType.js";

export const classtypeRouter = Router()

classtypeRouter.get('/', findAll)
classtypeRouter.get('/:id', findOne)
classtypeRouter.post('/', sanitizeClassType, add)
classtypeRouter.put('/:id', sanitizeClassType, update)
classtypeRouter.patch('/:id', sanitizeClassType, update)
classtypeRouter.delete('/:id', remove)
