import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { Exercise } from "./exercise.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";

const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const exercises = await em.find(Exercise, {});
      res.json({ message: "All exercises were found", data: exercises });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exercise = await em.findOneOrFail(Exercise, { id });
      res.status(200).json({ message: "Exercise found", data: exercise });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const exercise = em.create(Exercise, req.body.sanitizedInput);

      const errors = await validate(exercise);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res.status(201).json({ message: "Exercise created", data: exercise });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exercise = await em.findOneOrFail(Exercise, { id });
      em.assign(exercise, req.body.sanitizedInput);

      const errors = await validate(exercise);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res.status(200).json({ message: "Exercise updated", data: exercise });
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

  sanitizeExercise: function (req: Request, _: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      urlVideo: req.body.urlVideo?.trim(),
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
