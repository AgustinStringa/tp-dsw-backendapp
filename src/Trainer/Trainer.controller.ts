import { Request, Response } from "express";
import { Trainer } from "./Trainer.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const trainers = await em.find(Trainer, {});
      res.json({ length: trainers?.length, data: trainers });
    } catch (error) {
      res.status(500).json({ message: "internal error" });
    }
  },
  findOne: async function (req: Request, res: Response) {
    try {
      const _id = new ObjectId(req.params.id);
      const trainer = await em.find(Trainer, { _id });
      if (!trainer) {
        res.status(404).send({ message: "Trainer not found" });
      } else {
        res.json({ data: trainer }).status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
  add: async function (req: Request, res: Response) {
    try {
      const trainer = await em.create(Trainer, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Client created", data: trainer });
    } catch (error) {
      res.status(500).json({ message: "internal error" });
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const _id = new ObjectId(req.params.id);
      const trainer = em.getReference(Trainer, _id);
      await em.removeAndFlush(trainer);
      res.status(200).json({ message: "Trainer deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const _id = new ObjectId(req.params.id);
      const trainer = await em.findOneOrFail(Trainer, { _id });
      em.assign(trainer, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Trainer updated", data: trainer });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { controller };
