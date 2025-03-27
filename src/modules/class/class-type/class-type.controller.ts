import { NextFunction, Request, Response } from "express";
import { ClassType } from "./class-type.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";
import { validateObjectId } from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const classtypes = await em.findAll(ClassType, {
        populate: ["classes", "classes.trainer"],
        populateWhere: { classes: { active: true } },
      });

      res.status(200).json({
        message: "Todos los tipos de clases fueron encontrados.",
        data: classtypes,
      });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const classtype = await em.findOneOrFail(ClassType, { id });

      res
        .status(200)
        .json({ message: "Tipo de clase encontrado.", data: classtype });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const classtype = em.create(ClassType, req.body.sanitizedInput);
      validateEntity(classtype);

      await em.flush();
      res
        .status(201)
        .json({ message: "Tipo de clase creado.", data: classtype });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const classtype = await em.findOneOrFail(ClassType, { id });

      em.assign(classtype, req.body.sanitizedInput);
      validateEntity(classtype);

      await em.flush();
      res
        .status(200)
        .json({ message: "Tipo de clase actualizado.", data: classtype });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const classtype = em.getReference(ClassType, id!);
      await em.removeAndFlush(classtype);

      res
        .status(200)
        .json({ message: "Tipo de clase eliminado.", data: classtype });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeClassType: function (
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};
