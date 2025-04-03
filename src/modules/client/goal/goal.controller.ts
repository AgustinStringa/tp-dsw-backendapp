import { NextFunction, Request, Response } from "express";
import {
  validateNumber,
  validateObjectId,
} from "../../../utils/validators/data-type.validators.js";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { authService } from "../../auth/auth/auth.service.js";
import { Goal } from "./goal.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const goals = await em.findAll(Goal, { populate: ["client"] });
      res
        .status(200)
        .json(new ApiResponse("Todas las metas fueron encontradas.", goals));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const goal = await em.findOneOrFail(
        Goal,
        { id },
        { populate: ["client"] }
      );

      res.status(200).json(new ApiResponse("Meta encontrada.", goal));
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
          .status(401)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      const goals = await em.find(Goal, {
        client: user,
      });
      res
        .status(200)
        .json(
          new ApiResponse(
            "Todas las metas del cliente fueron encontradas.",
            goals
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
          .status(401)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      const goal = em.create(Goal, req.body.sanitizedInput);
      validateEntity(goal);
      await em.flush();

      res.status(201).json(new ApiResponse("Meta creada.", goal));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const { user } = await authService.getUser(req);
      const id = validateObjectId(req.params.id, "id");
      const goal = await em.findOneOrFail(Goal, id!);

      if (
        goal.client.id !== user.id ||
        (req.body.sanitizedInput.client !== undefined &&
          req.body.sanitizedInput.client !== user.id)
      )
        return res
          .status(401)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      em.assign(goal, req.body.sanitizedInput);
      validateEntity(goal);

      await em.flush();

      res.status(200).json(new ApiResponse("Meta actualizada.", goal));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const { user } = await authService.getUser(req);

      const id = validateObjectId(req.params.id, "id");
      const goal = await em.findOneOrFail(Goal, id!);

      if (goal.client.id !== user.id)
        return res
          .status(401)
          .json(new ApiResponse("Cliente no autorizado.", null, false));

      await em.removeAndFlush(goal);

      res.status(200).json(new ApiResponse("Meta eliminada.", goal));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeGoal: function (req: Request, res: Response, next: NextFunction) {
    try {
      const allowUndefined = req.method === "PATCH";

      req.body.sanitizedInput = {
        fatPercentage: validateNumber(
          req.body.fatPercentage,
          2,
          "fatPercentage",
          allowUndefined,
          true,
          100
        ),
        bodyMeasurements: req.body.bodyMeasurements?.trim(),
        done: req.body.done,
        client: validateObjectId(req.body.clientId, "clientId", allowUndefined),
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
