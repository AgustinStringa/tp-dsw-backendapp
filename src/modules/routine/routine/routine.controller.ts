import { startOfDay, getDay } from "date-fns";
import { Request, Response, NextFunction } from "express";
import { authService } from "../../auth/auth/auth.service.js";
import { Client } from "../../client/client/client.entity.js";
import { ExerciseRoutine } from "../exercise-routine/exercise-routine.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Routine } from "./routine.entity.js";
import { routineService } from "./routine.service.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";
import {
  validateDateTime,
  validateObjectId,
} from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const routines = await em.find(
        Routine,
        {},
        {
          populate: ["client", "trainer", "exercisesRoutine.exercise"],
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
      const id = validateObjectId(req.params.id, "id");
      const routine = await em.findOneOrFail(
        Routine,
        { id },
        {
          populate: ["client", "trainer", "exercisesRoutine.exercise"],
        }
      );
      res.status(200).json({ message: "Rutina encontrada.", data: routine });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await routineService.checkDates(req.body.sanitizedInput, true);
      await em.findOneOrFail(Client, req.body.sanitizedInput.client);

      const routine = em.create(Routine, req.body.sanitizedInput);
      validateEntity(routine);
      await routineService.validateExercises(routine);

      await em.flush();
      res.status(201).json({ message: "Rutina creada.", data: routine });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const routine = await em.findOneOrFail(
        Routine,
        { id },
        { populate: ["exercisesRoutine"] }
      );

      const aux = { ...routine, ...req.body.sanitizedInput };

      let checkStart = false;
      if (req.body.sanitizedInput.start !== undefined) checkStart = true;

      if (req.body.sanitizedInput.client)
        await em.findOneOrFail(Client, aux.client);

      await routineService.checkDates(aux, checkStart);

      em.assign(routine, req.body.sanitizedInput);
      validateEntity(routine);
      await routineService.validateExercises(routine);

      await em.flush();
      res.status(200).json({ message: "Rutina actualizada.", data: routine });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id", false);
      const routine = em.getReference(Routine, id as string);
      await em.removeAndFlush(routine);

      res.status(200).json({ message: "Rutina eliminada." });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findCurrentRoutine: async (req: Request, res: Response) => {
    try {
      const userId = validateObjectId(req.params.userId, "userId");
      const today: Date = new Date();

      const routine = await em.findOne(
        Routine,
        {
          $and: [
            { client: userId },
            { start: { $lte: today } },
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
        return res
          .status(404)
          .json({ message: "No se encontró ninguna rutina actual." });
      }

      res.status(200).json({ message: "Rutina encontrada", data: routine });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  sanitizeRoutine: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      let start = validateDateTime(req.body.start, "start");
      let end = validateDateTime(req.body.end, "end");

      if (start !== undefined) {
        start = startOfDay(start);
        if (getDay(start) !== 1) {
          res.status(400).json({
            message: "Las fechas de inicio y de fin deben ser lunes.",
          });
          return;
        }
      }

      if (end !== undefined) {
        end = startOfDay(end);
        if (getDay(end) !== 1) {
          res.status(400).json({
            message: "Las fechas de inicio y de fin deben ser lunes.",
          });
          return;
        }
      }

      req.body.sanitizedInput = {
        start: start,
        end: end,
        trainer: (await authService.getUser(req)).user,
        client: validateObjectId(req.body.client_id, "client_id", true),
        exercisesRoutine: req.body.exercisesRoutine,
      };

      Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key];
        }
      });

      req.body.sanitizedInput.exercisesRoutine?.forEach(
        (e: ExerciseRoutine) => {
          validateObjectId(e.exercise, "exercise");
          if (req.method === "POST") e.weight = null;
        }
      );

      next();
    } catch (error: any) {
      handleError(error, res);
    }
  },
};
