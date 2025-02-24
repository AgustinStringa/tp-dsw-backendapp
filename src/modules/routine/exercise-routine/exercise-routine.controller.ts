import { Request, Response, NextFunction } from "express";
import { Exercise } from "../exercise/exercise.entity.js";
import { ExerciseRoutine } from "./exercise-routine.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Routine } from "../routine/routine.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const exercisesRoutine = await em.find(
        ExerciseRoutine,
        {},
        {
          populate: ["exercise", "routine"],
        }
      );
      res.status(200).json({
        message: "All exercises routine were found",
        data: exercisesRoutine,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exerciseRoutine = await em.findOneOrFail(
        ExerciseRoutine,
        { id },
        {
          populate: ["exercise", "routine"],
        }
      );
      res
        .status(200)
        .json({ message: "Exercise routine found", data: exerciseRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Exercise, { id: req.body.exercise });
      await em.findOneOrFail(Routine, { id: req.body.routine });

      const exerciseRoutine = em.create(
        ExerciseRoutine,
        req.body.sanitizedInput
      );
      await em.flush();
      res
        .status(201)
        .json({ message: "Exercise routine created", data: exerciseRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (req.body.exercise !== undefined) {
        await em.findOneOrFail(Exercise, { id: req.body.exercise });
      }
      if (req.body.routine !== undefined) {
        await em.findOneOrFail(Routine, { id: req.body.routine });
      }
      const exerciseRoutine = await em.findOneOrFail(ExerciseRoutine, { id });
      em.assign(exerciseRoutine, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: "Exercise routine updated", data: exerciseRoutine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exerciseRoutine = em.getReference(ExerciseRoutine, id);
      await em.removeAndFlush(exerciseRoutine);
      res.status(200).json({ message: "Exercise routine deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeExerciseRoutine: function (
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
      exercise: req.body.exercise,
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
