import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Client } from "./Client.entity.js";
import { Goal } from "./Goal.entity.js";

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
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Client, req.body.sanitizedInput.client);
      const goal = em.create(Goal, req.body.sanitizedInput);
      await em.flush();

      res.status(201).json({ message: "Goal created", data: goal });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, req.body.sanitizedInput.client);

      const id = req.params.id;
      const goal = await em.findOneOrFail(Goal, id);
      em.assign(goal, req.body.sanitizedInput);
      await em.flush();

      res.status(200).json({ message: "Goal updated", data: goal });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
      bodyMeasurements: req.body.bodyMeasurements,
      done: req.body.done,
      client: req.body.client,
    };
    //more checks about data type...

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};

export { controller };
