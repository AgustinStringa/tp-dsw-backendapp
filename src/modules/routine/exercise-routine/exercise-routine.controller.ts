import { NextFunction, Request, Response } from "express";
import { authService } from "../../auth/auth/auth.service.js";
import { Exercise } from "../exercise/exercise.entity.js";
import { ExerciseRoutine } from "./exercise-routine.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Routine } from "../routine/routine.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";
import { validateObjectId } from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

export const controller = {
  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Exercise, { id: req.body.exercise });
      await em.findOneOrFail(Routine, { id: req.body.routine });

      const exerciseRoutine = em.create(
        ExerciseRoutine,
        req.body.sanitizedInput
      );

      validateEntity(exerciseRoutine);
      await em.flush();

      res.status(201).json({
        message: "Se agregó el ejercicio a la rutina.",
        data: exerciseRoutine,
      });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  markAsDone: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exerciseRoutine = await em.findOneOrFail(
        ExerciseRoutine,
        { id },
        { populate: ["routine.client"] }
      );

      if (exerciseRoutine.routine.end <= new Date()) {
        res.status(400).json({ message: "La rutina ya finalizó." });
        return;
      }

      const { user } = await authService.getUser(req);
      if (exerciseRoutine.routine.client !== user) {
        res.status(401).json({ message: "Cliente no autorizado." });
        return;
      }

      em.assign(exerciseRoutine, req.body.sanitizedInput);
      validateEntity(exerciseRoutine);
      await em.flush();

      res.status(200).json({
        message: "Se registró la ejecución del ejercicio.",
        data: exerciseRoutine,
      });
    } catch (error: unknown) {
      handleError(error, res);
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
      validateEntity(exerciseRoutine);
      await em.flush();

      res.status(200).json({
        message: "Se actualizó el ejercicio de la rutina.",
        data: exerciseRoutine,
      });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const exerciseRoutine = em.getReference(ExerciseRoutine, id);
      await em.removeAndFlush(exerciseRoutine);

      res.status(200).json({ message: "Se quitó el ejercicio de la rutina." });
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeExerciseRoutine: function (
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    const allowUndefined = req.method === "PATCH";

    req.body.sanitizedInput = {
      day: req.body.day,
      week: req.body.week,
      series: req.body.series,
      repetitions: req.body.repetitions,
      weight: req.body.weight,
      routine: validateObjectId(req.body.routine, "routineId", allowUndefined),
      exercise: validateObjectId(
        req.body.exercise,
        "exerciseId",
        allowUndefined
      ),
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });
    next();
  },

  sanitizeExecution: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      weight: Number(req.body.weight),
    };

    if (
      isNaN(req.body.sanitizedInput.weight) ||
      req.body.sanitizedInput.weight < 0
    ) {
      res.status(401).json({ message: "El peso no es válido." });
      return;
    }

    next();
  },
};
