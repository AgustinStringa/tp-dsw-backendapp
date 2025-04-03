import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import bcrypt from "bcrypt";
import { Client } from "../../client/client/client.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Trainer } from "./trainer.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";
import { validateObjectId } from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const trainers = await em.findAll(Trainer);
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
      const trainer = em.create(Trainer, req.body.sanitizedInput);
      validateEntity(trainer);

      const client = await em.findOne(Client, { email: trainer.email });
      if (client !== null) {
        return res
          .status(409)
          .send(
            new ApiResponse("El correo electrónico ya se encuentra en uso.")
          );
      }

      await em.flush();
      res.status(201).json(new ApiResponse("Entrenador creado.", trainer));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const trainer = await em.findOneOrFail(Trainer, { id: req.params.id });
      em.assign(trainer, req.body.sanitizedInput);
      validateEntity(trainer);

      if (req.body.sanitizedInput.email !== undefined) {
        const client = await em.findOne(Client, { email: trainer.email });
        if (client !== null) {
          return res
            .status(409)
            .send(
              new ApiResponse("El correo electrónico ya se encuentra en uso.")
            );
        }
      }

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

  sanitizeTrainer: function (req: Request, _: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      lastName: req.body.lastName?.trim(),
      firstName: req.body.firstName?.trim(),
      dni: req.body.dni?.toString().trim(),
      email: req.body.email?.trim(),
      password: req.body.password,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    if (req.body.sanitizedInput.password) {
      if (req.body.sanitizedInput.password.length >= 4) {
        req.body.sanitizedInput.password = bcrypt.hashSync(
          req.body.sanitizedInput.password,
          10
        );
      } else {
        req.body.sanitizedInput.password = "";
      }
    }

    next();
  },
};
