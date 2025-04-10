import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { Exercise } from "./exercise.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";
import { validateObjectId } from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const exercises = await em.findAll(Exercise, {
        orderBy: { name: "asc" },
      });

      res
        .status(200)
        .json(
          new ApiResponse("Todos los ejercicios fueron encontrados.", exercises)
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const exercise = await em.findOneOrFail(Exercise, { id });
      res.status(200).json(new ApiResponse("Ejercicio encontrado.", exercise));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const exercise = em.create(Exercise, req.body.sanitizedInput);
      validateEntity(exercise);

      await em.flush();
      res.status(201).json(new ApiResponse("Ejercicio creado.", exercise));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const exercise = await em.findOneOrFail(Exercise, { id });
      em.assign(exercise, req.body.sanitizedInput);

      validateEntity(exercise);
      await em.flush();

      res.status(200).json(new ApiResponse("Ejercicio actualizado.", exercise));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exercise = em.getReference(Exercise, id);
      await em.removeAndFlush(exercise);
      res.status(200).json(new ApiResponse("Ejercicio eliminado."));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeExercise: function (req: Request, _: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      urlVideo: req.body.urlVideo?.trim(),
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};
