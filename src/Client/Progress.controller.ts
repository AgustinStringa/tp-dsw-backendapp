import { Request, Response, NextFunction } from "express";
import { Progress } from "./Progress.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Client } from "./Client.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const progresses = await em.find(Progress, {}, { populate: ["client"] });
      res
        .status(200)
        .json({ message: "All progresses were found", data: progresses });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const clientId = req.body.sanitizedInput.client;
      const client = await em.findOne(Client, { id: clientId });

      if (!client) return res.status(404).json({ message: "Client not found" });

      const progress = em.create(Progress, req.body.sanitizedInput);
      await em.flush();

      res.status(201).json({ message: "Progress created", data: progress });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      if (req.body.sanitizedInput.client) {
        const clientId = req.body.sanitizedInput.client;
        const client = await em.findOne(Client, { id: clientId });
        if (!client)
          return res.status(404).json({ message: "Client not found" });
      }

      const id = req.params.id;
      const progress = await em.findOneOrFail(
        Progress,
        { id },
        { populate: ["client"] }
      );
      em.assign(progress, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Progress updated", data: progress });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const progress = em.getReference(Progress, id);
      await em.removeAndFlush(progress);
      res.status(200).json({ message: "Progress deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeProgress: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      date: req.body.date,
      weight: req.body.weight,
      fatPercentage: req.body.fatPercentage,
      bodyMeasurements: req.body.bodyMeasurements,
      client: req.body.client,
    };
    //more checks about malicious content, sql injections, data type...

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};

export { controller };
