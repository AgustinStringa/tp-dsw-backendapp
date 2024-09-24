import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Routine } from "./Routine.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { Client } from "../Client/Client.entity.js";
import { addDays, startOfWeek, startOfDay } from "date-fns";
import { NotFoundError } from "@mikro-orm/core";
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
      const firstMonday = addDays(startOfWeek(new Date()), 1);
      if (req.body.start < firstMonday) {
        return res.status(400).json({
          message: "Routine's start date must be greater than last monday",
        });
      }
      const trainer = await em.findOneOrFail(Trainer, { id: req.body.trainer });
      const client = await em.findOneOrFail(
        Client,
        { id: req.body.client },
        { populate: ["routines"] }
      );
      //new date es necesario para la comparacion exitosa de fechas
      // de otro modo no funciona
      const routinesOverlap = await orm.em.find(Routine, {
        $and: [
          {
            client: { $eq: req.body.client },
          },
          {
            $or: [
              {
                start: { $lt: new Date(req.body.end) },
                end: { $gt: new Date(req.body.start) },
              },
            ],
          },
        ],
      });

      if (routinesOverlap.length <= 0) {
        const routine = em.create(Routine, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: "Routine created", data: routine });
      } else {
        return res.status(400).json({
          message: "There is overlap between routines",
          data: routinesOverlap[0],
        });
      }
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
      start: startOfDay(req.body.start),
      end: startOfDay(req.body.end),
      trainer: req.body.trainer,
      client: req.body.client,
      exercisesRoutine: req.body.exercisesRoutine,
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
