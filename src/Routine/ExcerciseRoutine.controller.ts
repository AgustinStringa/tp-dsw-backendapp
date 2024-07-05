import { Request, Response, NextFunction } from "express";
import { ExcerciseRoutine } from "./ExcerciseRoutine.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Excercise } from "./Exercise.entity.js";
import { Routine } from "./Routine.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const excercisesRoutine = await em.find(
        ExcerciseRoutine,
        {},
        {
          populate: ["excercise", "routine"],
        }
      );
      res.status(200).json({
        message: "All excercises routine were found",
        data: excercisesRoutine,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const excerciseRoutine = await em.findOneOrFail(
        ExcerciseRoutine,
        { id },
        {
          populate: ["excercise", "routine"],
        }
      );
      res
        .status(200)
        .json({ message: "Excercise routine found", data: excerciseRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Excercise, { id: req.body.excercise });
      await em.findOneOrFail(Routine, { id: req.body.routine });

      const excerciseRoutine = em.create(
        ExcerciseRoutine,
        req.body.sanitizedInput
      );
      await em.flush();
      res
        .status(201)
        .json({ message: "Excercise routine created", data: excerciseRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      await em.findOneOrFail(Excercise, { id: req.body.excercise });
      await em.findOneOrFail(Routine, { id: req.body.routine });
      const excerciseRoutine = await em.findOneOrFail(ExcerciseRoutine, { id });
      em.assign(excerciseRoutine, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: "Excercise routine updated", data: excerciseRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const excerciseRoutine = em.getReference(ExcerciseRoutine, id);
      await em.removeAndFlush(excerciseRoutine);
      res.status(200).json({ message: "Excercise routine deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeExcerciseRoutine: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      day: req.body.day,
      week: req.body.week,
      series: req.body.series,
      repetitions: req.body.repetitions,
      weight: req.body.weight,
      routine: req.body.routine,
      excercise: req.body.excercise,
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
