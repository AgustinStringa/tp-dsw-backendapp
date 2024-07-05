import { Request, Response, NextFunction } from "express";
import { Excercise } from "./Exercise.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const excercises = await em.find(
        Excercise,
        {},
        {
          populate: ["trainer", "excercisesDone"],
        }
      );
      res.json({ message: "All Excercises were found", data: excercises });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const excercise = await em.findOneOrFail(
        Excercise,
        { id },
        {
          populate: ["trainer", "excercisesDone"],
        }
      );
      if (!excercise) {
        res.status(404).send({ message: "Excercise not found" });
      } else {
        res.json({ data: excercise }).status(200);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  add: async function (req: Request, res: Response) {
    try {
      const excercise = em.create(Excercise, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Excercise created", data: excercise });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const excercise = em.getReference(Excercise, id);
      await em.removeAndFlush(excercise);
      res.status(200).json({ message: "Excercise deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      if (req.body.trainer) {
        const trainer = await em.findOneOrFail(Trainer, {
          id: req.body.trainer,
        });
        if (!trainer) {
          res.status(404).json({ message: "Trainer not fund" });
        }
      }
      const id = req.params.id;
      const excercise = await em.findOneOrFail(Excercise, { id });
      em.assign(excercise, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Excercise updated", data: excercise });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  sanitizeExcercise: function (req: Request, _: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      name: req.body.name,
      description: req.body.description,
      urlVideo: req.body.urlVideo,
      trainer: req.body.trainer,
      excercisesDone: req.body.excercisesDone,
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
