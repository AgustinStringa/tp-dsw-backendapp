import { addDays, startOfWeek, startOfDay } from "date-fns";
import { NotFoundError } from "@mikro-orm/core";
import { Request, Response, NextFunction } from "express";
import { Client } from "../Client/Client.entity.js";
import { Exercise } from "./Exercise.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Routine } from "./Routine.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";

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
          populate: [
            "client",
            "trainer",
            "exercisesRoutine",
            "exercisesRoutine.exercise",
          ],
        }
      );
      res.status(200).json({ message: "Routine found", data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      if (req.body.start > req.body.end) {
        return res.status(400).json({
          message: "End date must be greather than start date",
        });
      }

      const thisWeekMonday = addDays(startOfWeek(new Date()), 1);
      if (req.body.start < thisWeekMonday) {
        return res.status(400).json({
          message: "Routine's start date must be greater than last monday",
        });
      }

      await em.findOneOrFail(Trainer, { id: req.body.trainer });
      await em.findOneOrFail(Client, { id: req.body.client });

      const routineOverlap = await orm.em.findOne(Routine, {
        $and: [
          {
            client: { $eq: req.body.client },
          },
          {
            $or: [
              {
                start: { $lt: new Date(req.body.sanitizedInput.end) },
                end: { $gt: new Date(req.body.sanitizedInput.start) },
              },
            ],
          },
        ],
      });

      if (routineOverlap) {
        return res.status(400).json({
          message: "There is overlap between routines",
          data: routineOverlap,
        });
      }

      const routine = em.create(Routine, req.body.sanitizedInput);
      const exercisesIds = [
        ...new Set(routine.exercisesRoutine.map((er) => er.exercise.id)),
      ];
      const exercises = await em.find(Exercise, { id: { $in: exercisesIds } });

      if (exercises.length !== exercisesIds.length)
        return res.status(400).json({
          message: "Some exercises were not found",
        });

      await em.flush();
      res.status(201).json({ message: "Routine created", data: routine });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
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

      //hay que realizar validaciones similares a las del método add

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

  findCurrentRoutine: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const today: Date = new Date();
      const routine = await em.findOne(
        Routine,
        {
          $and: [
            { client: userId },
            { start: { $lt: today } },
            { end: { $gt: today } },
          ],
        },
        {
          populate: [
            "client",
            "trainer",
            "exercisesRoutine",
            "exercisesRoutine.exercise",
          ],
        }
      );

      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }

      res.status(200).json({ message: "Routine found", data: routine });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeRoutine: function (req: Request, res: Response, next: NextFunction) {
    try {
      req.body.sanitizedInput = {
        start: startOfDay(req.body.start),
        end: startOfDay(req.body.end),
        trainer: req.body.trainer,
        client: req.body.client,
        exercisesRoutine: req.body.exercisesRoutine, //en un post weight debe ser nulo
      };
    } catch {
      res.status(400).json({ message: "Bad request" }); //se ejecuta si se envía una fecha con formato no válido
    }

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};

export { controller };
