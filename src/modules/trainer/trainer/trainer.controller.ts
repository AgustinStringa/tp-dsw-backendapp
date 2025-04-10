import { NextFunction, Request, Response } from "express";
import {
  validateObjectId,
  validatePassword,
} from "../../../utils/validators/data-type.validators.js";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { checkUsersUniqueIndexes } from "../../../utils/validators/indexes.validator.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Trainer } from "./trainer.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const trainers = await em.findAll(Trainer, {
        orderBy: { lastName: "asc", firstName: "asc" },
      });

      res.json(
        new ApiResponse("Todos los entrenadores fueron encontrados.", trainers)
      );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const trainer = await em.findOneOrFail(Trainer, { id });

      res.status(200).json(new ApiResponse("Entrenador encontrado", trainer));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await checkUsersUniqueIndexes(req.body.sanitizedInput);

      const trainer = em.create(Trainer, req.body.sanitizedInput);
      validateEntity(trainer);

      await em.flush();
      res.status(201).json(new ApiResponse("Entrenador creado.", trainer));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");

      const trainer = await em.findOneOrFail(Trainer, id!);
      await checkUsersUniqueIndexes(req.body.sanitizedInput, trainer.id);

      em.assign(trainer, req.body.sanitizedInput);
      validateEntity(trainer);
      await em.flush();

      res.status(200).json(new ApiResponse("Entrenador actualizado.", trainer));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const trainer = em.getReference(Trainer, id);
      await em.removeAndFlush(trainer);
      res.status(200).json(new ApiResponse("Entrenador eliminado."));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeTrainer: function (req: Request, res: Response, next: NextFunction) {
    try {
      const canBeUndefined = req.method === "PATCH" || req.method === "PUT";

      req.body.sanitizedInput = {
        lastName: req.body.lastName?.trim(),
        firstName: req.body.firstName?.trim(),
        dni: req.body.dni?.toString().trim(),
        email: req.body.email?.trim(),

        password: validatePassword(
          req.body.password,
          "password",
          canBeUndefined
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
