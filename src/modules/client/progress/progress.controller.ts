import { NextFunction, Request, Response } from "express";
import {
  validateDateTime,
  validateNumber,
  validateObjectId,
} from "../../../utils/validators/data-type.validators.js";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { authService } from "../../auth/auth/auth.service.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Progress } from "./progress.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const progresses = await em.findAll(Progress, { populate: ["client"] });
      res
        .status(200)
        .json(
          new ApiResponse("Todos los progresos fueron encontrados", progresses)
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const progress = await em.findOneOrFail(
        Progress,
        { id },
        { populate: ["client"] }
      );

      res.status(200).json(new ApiResponse("Progreso encontrado.", progress));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findByClient: async function (req: Request, res: Response) {
    try {
      const clientId = validateObjectId(req.params.clientId, "clientId");
      const { user } = await authService.getUser(req);

      if (clientId !== user.id)
        return res
          .status(403)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      const progresses = await em.find(Progress, {
        client: user.id,
      });

      res
        .status(200)
        .json(
          new ApiResponse(
            "Todos los progresos del cliente fueron encontrados.",
            progresses
          )
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const { user } = await authService.getUser(req);

      if (req.body.sanitizedInput.client !== user.id)
        return res
          .status(403)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      const progress = em.create(Progress, req.body.sanitizedInput);
      validateEntity(progress);
      await em.flush();

      res.status(201).json(new ApiResponse("Progreso creado.", progress));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const { user } = await authService.getUser(req);
      const id = validateObjectId(req.params.id, "id");
      const progress = await em.findOneOrFail(Progress, id!);

      if (
        progress.client.id !== user.id ||
        (req.body.sanitizedInput.client !== undefined &&
          req.body.sanitizedInput.client !== user.id)
      )
        return res
          .status(403)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      em.assign(progress, req.body.sanitizedInput);
      validateEntity(progress);

      await em.flush();

      res.status(200).json(new ApiResponse("Progreso actualizado.", progress));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const { user } = await authService.getUser(req);

      const id = validateObjectId(req.params.id, "id");
      const progress = await em.findOneOrFail(Progress, id!);

      if (progress.client.id !== user.id)
        return res
          .status(403)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      await em.removeAndFlush(progress);

      res.status(200).json(new ApiResponse("Progreso eliminado."));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeProgress: function (req: Request, res: Response, next: NextFunction) {
    try {
      const allowUndefined = req.method === "PATCH";

      req.body.sanitizedInput = {
        date: validateDateTime(req.body.date, "date"),
        weight: validateNumber(
          req.body.weight,
          2,
          "weight",
          allowUndefined,
          false
        ),

        fatPercentage: validateNumber(
          req.body.fatPercentage,
          2,
          "fatPercentage",
          allowUndefined,
          false,
          100
        ),

        bodyMeasurements: req.body.bodyMeasurements?.trim(),
        client: validateObjectId(req.body.clientId, "clientId", allowUndefined),
      };

      Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key];
        }
      });

      if (req.body.sanitizedInput?.date > new Date()) {
        return res
          .status(400)
          .json(
            new ApiResponse("La fecha no puede ser posterior a este momento.")
          );
      }

      next();
    } catch (error: unknown) {
      handleError(error, res);
    }
  },
};
