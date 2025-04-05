import { NextFunction, Request, Response } from "express";
import {
  validateObjectId,
  validatePassword,
} from "../../../utils/validators/data-type.validators.js";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { authService } from "../../auth/auth/auth.service.js";
import { checkUsersUniqueIndexes } from "../../../utils/validators/indexes.validator.js";
import { Client } from "./client.entity.js";
import { clientService } from "./client.service.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const clients = await em.findAll(Client, {
        fields: ["lastName", "firstName", "dni", "email"],
        orderBy: { lastName: "asc", firstName: "asc" }, //es sensible a mayúsculas y minúsculas
      });

      res
        .status(200)
        .json(
          new ApiResponse("Todos los clientes fueron encontrados.", clients)
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const client = await em.findOneOrFail(
        Client,
        { id },
        { populate: ["progresses", "goals"] }
      );

      res.status(200).json(new ApiResponse("Cliente encontrado.", client));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await checkUsersUniqueIndexes(req.body.sanitizedInput);

      const client = em.create(Client, req.body.sanitizedInput);
      validateEntity(client);

      await em.flush();
      clientService.startSessionOnRegister(req, res, client);
      clientService.sendRegistrationEmail(client);

      const userReturn = {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        dni: client.dni,
        email: client.email,
        isClient: true,
      };

      return res
        .status(201)
        .json(new ApiResponse("Cliente creado.", userReturn));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const { user, isTrainer } = await authService.getUser(req);

      if (!isTrainer && user.id !== id) {
        res.status(401).json(new ApiResponse("Cliente no autorizado."));
        return;
      }

      const client = await em.findOneOrFail(Client, { id });
      await checkUsersUniqueIndexes(req.body.sanitizedInput, client.id);

      em.assign(client, req.body.sanitizedInput);

      validateEntity(client);
      await em.flush();

      res.status(200).json(new ApiResponse("Cliente actualizado.", client));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const client = em.getReference(Client, id);
      await em.removeAndFlush(client);
      res.status(200).json(new ApiResponse("Cliente eliminado."));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeClient: function (req: Request, res: Response, next: NextFunction) {
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

  sanitizeSelfUpdate: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      req.body.sanitizedInput = {
        email: req.body.email?.trim(),
        password: validatePassword(req.body.password, "password", true),
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
