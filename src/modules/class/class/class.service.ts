import { Class } from "./class.entity.js";
import { ClassType } from "../class-type/class-type.entity.js";
import { HttpError } from "../../../utils/errors/http-error.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { sendEmail } from "../../../utils/notifications/notifications.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";

const em = orm.em;

const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const classService = {
  checkTimes: async (classToCheck: Class) => {
    if (classToCheck.startTime >= classToCheck.endTime) {
      throw new HttpError(
        400,
        "La hora de fin debe ser posterior a la hora de inicio."
      );
    }

    const classOverlap = await em.findOne(Class, {
      _id: { $ne: classToCheck._id },
      day: classToCheck.day,
      trainer: classToCheck.trainer,
      $and: [
        { startTime: { $not: { $gte: classToCheck.endTime } } },
        { endTime: { $not: { $lte: classToCheck.startTime } } },
      ],
    });

    if (classOverlap)
      throw new HttpError(
        409,
        `Ya tienes una clase los ${days[classToCheck.day]} de las ${
          classOverlap.startTime
        } a las ${classOverlap.endTime}.`
      );
  },

  sendNewClassEmail: async (
    newClass: Class,
    type: ClassType,
    trainer: Trainer
  ) => {
    sendEmail(
      "Gimnasio Iron Haven - Nueva clase disponible",
      `
      <h3>Nueva clase de ${type.name}</h3>
      <div>
        <p>Se dictará una nueva clase los días ${days[newClass.day]} de 
          ${newClass.startTime} a 
          ${newClass.endTime}.
        </p>
        <p><b>Descripción: </b>${type.description}</p>
        <p><b>Ubicación: </b>${newClass.location}</p>
        <p>La clase estará a cargo de 
          ${trainer.firstName + " " + trainer.lastName} y cuenta con 
          <b>${newClass.maxCapacity} cupos</b>.
        </p>
        <p><b>¡Corre a inscribirte antes de que se acaben!</b></p>
      </div>
      `
    );
  },
};
