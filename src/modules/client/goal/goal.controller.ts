import { Request, Response, NextFunction } from "express";
import { authService } from "../../auth/auth/auth.service.js";
import { Client } from "../client/client.entity.js";
import { Goal } from "./goal.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const goals = await em.find(Goal, {}, { populate: ["client"] });
      res.status(200).json({ message: "All goals were found", data: goals });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const goal = await em.findOneOrFail(
        Goal,
        { id },
        { populate: ["client"] }
      );
      res.status(200).json({ message: "Goal found", data: goal });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const goal = em.create(Goal, req.body.sanitizedInput);
      validateEntity(goal);

      await em.findOneOrFail(Client, req.body.sanitizedInput.client);
      await em.flush();

      res.status(201).json({ message: "Goal created", data: goal });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  findByClient: async function (req: Request, res: Response) {
    try {
      const userIdParam = req.params.id;
      const { user } = await authService.getUser(req);

      if (userIdParam !== user.id)
        return res.status(401).json({ message: "Client unauthorized." });

      const goals = await em.find(Goal, {
        client: user,
      });
      res
        .status(200)
        .json({ message: "All goals of the client were found.", data: goals });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const goal = await em.findOneOrFail(Goal, { id: req.params.id });
      em.assign(goal, req.body.sanitizedInput);
      validateEntity(goal);

      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, req.body.sanitizedInput.client);

      await em.flush();

      res.status(200).json({ message: "Goal updated", data: goal });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const goal = em.getReference(Goal, id);
      await em.removeAndFlush(goal);
      res.status(200).json({ message: "Goal deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeGoal: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      fatPercentage: req.body.fatPercentage,
      bodyMeasurements: req.body.bodyMeasurements?.trim(),
      done: req.body.done,
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

export { controller };
