import { NextFunction, Request, Response } from "express";
import {
  validateObjectId,
  validateTime,
} from "../../../utils/validators/data-type.validators.js";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { Class } from "./class.entity.js";
import { classService } from "./class.service.js";
import { ClassType } from "../class-type/class-type.entity.js";
import { Client } from "../../client/client/client.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";
const em = orm.em;

export const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const classes = await em.findAll(Class, {
        populate: ["classType", "trainer"],
      });

      res
        .status(200)
        .json(new ApiResponse("Todas las clases fueron encontradas.", classes));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findActive: async function (_: Request, res: Response) {
    try {
      const classes = await em.find(
        Class,
        { active: true },
        {
          populate: ["classType", "trainer"],
        }
      );

      res
        .status(200)
        .json(new ApiResponse("Todas las clases fueron encontradas.", classes));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const classFound = await em.findOneOrFail(
        Class,
        { id },
        { populate: ["classType", "trainer"] }
      );

      res.status(200).json(new ApiResponse("Clase encontrada.", classFound));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const classType = await em.findOneOrFail(
        ClassType,
        req.body.sanitizedInput.classType
      );

      await classService.checkTimes(req.body.sanitizedInput);

      const newClass = em.create(Class, req.body.sanitizedInput);
      validateEntity(newClass);

      const emails = (await em.findAll(Client, { fields: ["email"] })).map(
        (c) => c.email
      );

      await classService.sendNewClassEmail(
        newClass,
        classType,
        newClass.trainer,
        emails
      );
      await em.flush();

      res.status(201).json(new ApiResponse("Clase creada.", newClass));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const classToUpdate = await em.findOneOrFail(Class, {
        id,
      });

      if (req.body.sanitizedInput.classType !== undefined)
        await em.findOneOrFail(ClassType, req.body.sanitizedInput.classType);

      if (
        req.body.sanitizedInput.startTime ||
        req.body.sanitizedInput.endTime
      ) {
        const aux = { ...classToUpdate, ...req.body.sanitizedInput };
        await classService.checkTimes(aux);
      }

      em.assign(classToUpdate, req.body.sanitizedInput);
      validateEntity(classToUpdate);
      await em.flush();

      res
        .status(200)
        .json(new ApiResponse("Clase actualizada.", classToUpdate));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");

      const classToDelete = await em.findOneOrFail(Class, id!);
      await em.removeAndFlush(classToDelete);

      res.status(200).json(new ApiResponse("Clase eliminada.", classToDelete));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeClass: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const allowUndefined = req.method === "PATCH";
      req.body.sanitizedInput = {
        day: req.body.day,
        startTime: validateTime(
          req.body.startTime,
          "startTime",
          allowUndefined
        ),
        endTime: validateTime(req.body.endTime, "endTime", allowUndefined),
        maxCapacity: req.body.maxCapacity,
        location: req.body.location?.trim(),
        active: req.body.active,
        classType: validateObjectId(
          req.body.classTypeId,
          "classTypeId",
          allowUndefined
        ),
        trainer: validateObjectId(
          req.body.trainerId,
          "trainerId",
          allowUndefined
        ),
      };

      Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key];
        }
      });

      next();
    } catch (error: unknown) {
      handleError(error, res);
    }
  },
};
