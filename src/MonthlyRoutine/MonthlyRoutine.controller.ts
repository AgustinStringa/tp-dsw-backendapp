import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { DailyRoutine } from "../DailyRoutine/DailyRoutine.entity.js";
import { MonthlyRoutine } from "./MonthlyRoutine.entity.js";
const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const monthlyRoutines = await em.find(
        MonthlyRoutine,
        {},
        {
          populate: ["client", "trainer", "days"],
        }
      );
      res.status(200).json({
        message: "All monthly routines were found",
        data: monthlyRoutines,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const monthlyRoutine = await em.findOneOrFail(
        MonthlyRoutine,
        { id },
        {
          populate: ["client", "trainer", "days"],
        }
      );
      res
        .status(200)
        .json({ message: "Monthly routine found", data: monthlyRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const monthlyRoutine = em.create(MonthlyRoutine, req.body.sanitizedInput);
      await em.flush();
      res
        .status(201)
        .json({ message: "Monthly routine created", data: monthlyRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const monthlyRoutine = await em.findOneOrFail(MonthlyRoutine, { id });
      em.assign(monthlyRoutine, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: "Monthly routine updated", data: monthlyRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const monthlyRoutine = em.getReference(MonthlyRoutine, id);
      await em.removeAndFlush(monthlyRoutine);
      res.status(200).json({ message: "Monthly routine deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeMonthlyRoutine: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
