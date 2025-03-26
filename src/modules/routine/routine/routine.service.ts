import { addDays, format, startOfWeek } from "date-fns";
import { Exercise } from "../exercise/exercise.entity.js";
import { HttpError } from "../../../utils/errors/http-error.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Routine } from "./routine.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const routineService = {
  checkDates: async (routine: any, checkStart: boolean) => {
    // Al interactuar con la colección Routine, el método debe invocarse antes de crear o actualizar la entidad Routine
    const thisWeekMonday = addDays(startOfWeek(new Date()), 1);
    if (checkStart && routine.start < thisWeekMonday) {
      throw new HttpError(
        400,
        "El inicio de la rutina debe ser el lunes de esta semana, o un lunes posterior."
      );
    }

    if (routine.start >= routine.end) {
      throw new HttpError(
        400,
        "La fecha de fin debe ser posterior a la fecha de inicio."
      );
    }

    const routineOverlap = await em.findOne(Routine, {
      $and: [
        {
          _id: { $ne: routine._id },
          client: routine.client,
        },
        {
          $or: [
            {
              start: { $lt: routine.end },
              end: { $gt: routine.start },
            },
          ],
        },
      ],
    });

    if (routineOverlap)
      throw new HttpError(
        409,
        `Ya existe una rutina que empieza el ${format(
          routineOverlap.start,
          "dd-MM-yyyy"
        )} y termina el ${format(routineOverlap.end, "dd-MM-yyyy")}.`
      );
  },

  validateExercises: async (routine: Routine) => {
    if (routine.exercisesRoutine.length === 0)
      throw new HttpError(400, "La rutina debe tener al menos 1 ejercicio.");

    const exercisesIds = [
      ...new Set(routine.exercisesRoutine.map((er) => er.exercise.id)),
    ];
    const count = await em.count(Exercise, { id: { $in: exercisesIds } });

    if (count !== exercisesIds.length)
      throw new HttpError(
        400,
        "No se pudieron encontrar todos los ejercicios."
      );

    const exerciseRoutineArray = routine.exercisesRoutine.getItems();
    exerciseRoutineArray.forEach((e) => {
      validateEntity(e);
    });
  },
};
