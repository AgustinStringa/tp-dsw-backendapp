import { Request, Response, NextFunction } from "express";
import { Progress } from "./Progress.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
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
      const _id = new ObjectId(req.params.id);
      const progress = await em.findOneOrFail(
        Progress,
        { _id },
        { populate: ["client"] }
      );
      res.status(200).json({ message: "Progress found", data: progress });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const _id = ObjectId.createFromHexString(req.body.sanitizedInput.client);
      const client = await em.findOne(Client, { _id });

      if (!client) return res.status(404).json({ message: "Client not found" });

      req.body.sanitizedInput.client = client;
      const progress = em.create(Progress, req.body.sanitizedInput);
      await em.flush();

      res.status(201).json({ message: "Progress created", data: progress });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      let _id = ObjectId.createFromHexString(req.body.sanitizedInput.client);
      const client = await em.findOne(Client, { _id });
      if (!client) return res.status(404).json({ message: "Client not found" });

      req.body.sanitizedInput.client = client;

      _id = new ObjectId(req.params.id);
      const progress = await em.findOneOrFail(
        Progress,
        { _id },
        { populate: ["client"] }
      );
      em.assign(progress, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Progress updated", data: progress });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  remove: async function (req: Request, res: Response) {
    try {
      const _id = new ObjectId(req.params.id);
      const progress = em.getReference(Progress, _id); //tener en cuenta que no verifica si existe el objeto antes de eliminarlo
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
