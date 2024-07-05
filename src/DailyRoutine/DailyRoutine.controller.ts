import { Request, Response, NextFunction } from "express";
import { DailyRoutine } from "./DailyRoutine.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const dailyRoutines = await em.find(
        DailyRoutine,
        {},
        {
          populate: ["monthlyRoutine"],
        }
      );
      res.status(200).json({
        message: "All daily routines were found",
        data: dailyRoutines,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const dailyRoutine = await em.findOneOrFail(DailyRoutine, { id });
      res
        .status(200)
        .json({ message: "Daily routine found", data: dailyRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const dailyRoutine = em.create(DailyRoutine, req.body.sanitizedInput);
      await em.flush();
      res
        .status(201)
        .json({ message: "Daily routine created", data: dailyRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const dailyRoutine = await em.findOneOrFail(DailyRoutine, { id });
      em.assign(dailyRoutine, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: "Daily routine updated", data: dailyRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const dailyRoutine = em.getReference(DailyRoutine, id);
      await em.removeAndFlush(dailyRoutine);
      res.status(200).json({ message: "Daily routine deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeDailyRoutine: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      day: req.body.day,
      monthlyRoutine: req.body.monthlyRoutine,
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
