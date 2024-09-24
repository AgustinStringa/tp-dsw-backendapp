import { Request, Response, NextFunction } from "express";
import { Exercise } from "./Exercise.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const exercises = await em.find(
        Exercise,
        {},
        {
          populate: [],
        }
      );
      res.json({ message: "All Exercises were found", data: exercises });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exercise = await em.findOneOrFail(
        Exercise,
        { id },
        {
          populate: [],
        }
      );
      if (!exercise) {
        res.status(404).send({ message: "Exercise not found" });
      } else {
        res.json({ data: exercise }).status(200);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  add: async function (req: Request, res: Response) {
    try {
      const exercise = em.create(Exercise, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Exercise created", data: exercise });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exercise = em.getReference(Exercise, id);
      await em.removeAndFlush(exercise);
      res.status(200).json({ message: "Exercise deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exercise = await em.findOneOrFail(Exercise, { id });
      em.assign(exercise, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Exercise updated", data: exercise });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  sanitizeExercise: function (req: Request, _: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      name: req.body.name,
      description: req.body.description,
      urlVideo: req.body.urlVideo,
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
