import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Client } from "./Client.entity.js";
import { Goal } from "./Goal.entity.js";
import { getUser } from "../Auth/Auth.controller.js";
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

      const errors = await validate(goal);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

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
      //por lo pronto se omite el accionar si se trata de un trainer
      const user = await getUser(req);
      if (user != null) {
        const userIdParam = req.params.id;
        const { id } = user;
        if (userIdParam != id)
          return res.status(401).json({ message: "client unauthorized" });
        const goals = await em.find(Goal, {
          client: id,
        });
        res
          .status(200)
          .json({ message: "All goals of the client were found", data: goals });
      } else {
        return res.status(404).json({ message: "client not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const goal = await em.findOneOrFail(Goal, { id: req.params.id });
      em.assign(goal, req.body.sanitizedInput);

      const errors = await validate(goal);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

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
