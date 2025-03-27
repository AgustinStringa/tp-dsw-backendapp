import { NextFunction, Request, Response } from "express";
import { authService } from "../../auth/auth/auth.service.js";
import { Client } from "../client/client.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Progress } from "./progress.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const progresses = await em.find(Progress, {}, { populate: ["client"] });
      res
        .status(200)
        .json({ message: "All progresses were found", data: progresses });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const progress = await em.findOneOrFail(
        Progress,
        { id },
        { populate: ["client"] }
      );
      res.status(200).json({ message: "Progress found", data: progress });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findByClient: async function (req: Request, res: Response) {
    try {
      const userIdParam = req.params.id;
      const { user } = await authService.getUser(req);

      if (userIdParam !== user.id)
        return res.status(401).json({ message: "client unauthorized." });

      const progresses = await em.find(Progress, {
        client: user.id,
      });
      res.status(200).json({
        message: "All progresses of the client were found.",
        data: progresses,
      });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const progress = em.create(Progress, req.body.sanitizedInput);
      validateEntity(progress);

      await em.findOneOrFail(Client, progress.client.id);

      await em.flush();

      res.status(201).json({ message: "Progress created", data: progress });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const progress = await em.findOneOrFail(Progress, req.params.id);
      em.assign(progress, req.body.sanitizedInput);

      validateEntity(progress);

      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, req.body.sanitizedInput.client);

      await em.flush();
      res.status(200).json({ message: "Progress updated", data: progress });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const progress = em.getReference(Progress, id);
      await em.removeAndFlush(progress);
      res.status(200).json({ message: "Progress deleted" });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeProgress: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      date: req.body.date,
      weight: req.body.weight,
      fatPercentage: req.body.fatPercentage,
      bodyMeasurements: req.body.bodyMeasurements?.trim(),
      client: req.body.client,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};
