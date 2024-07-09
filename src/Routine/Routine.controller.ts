import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Routine } from "./Routine.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { Client } from "../Client/Client.entity.js";
const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const routines = await em.find(
        Routine,
        {},
        {
          populate: ["client", "trainer", "exercisesRoutine"],
        }
      );
      res.status(200).json({
        message: "All routines were found",
        data: routines,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const routine = await em.findOneOrFail(
        Routine,
        { id },
        {
          populate: ["client", "trainer", "exercisesRoutine"],
        }
      );
      res.status(200).json({ message: "Routine found", data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Trainer, { id: req.body.trainer });
      await em.findOneOrFail(Client, { id: req.body.client });
      const routine = em.create(Routine, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Routine created", data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      if (req.body.trainer !== undefined) {
        await em.findOneOrFail(Trainer, { id: req.body.trainer });
      }
      if (req.body.client) {
        await em.findOneOrFail(Client, { id: req.body.client });
      }
      const id = req.params.id;
      const routine = await em.findOneOrFail(Routine, { id });
      em.assign(routine, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Routine updated", data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const routine = em.getReference(Routine, id);
      await em.removeAndFlush(routine);
      res.status(200).json({ message: "Routine deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeRoutine: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      month: req.body.month,
      year: req.body.year,
      trainer: req.body.trainer,
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
