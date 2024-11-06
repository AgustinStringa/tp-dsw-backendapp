import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { Class } from "./Class.entity.js";
import { ClassType } from "./ClassType.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { sendEmail } from "../Notifications/Notifications.js";
import { Registration } from "./Registration.entity.js";
import { Client } from "../Client/Client.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const classes = await em.find(
        Class,
        {},
        { populate: ["classType", "trainer"] }
      );
      res
        .status(200)
        .json({ message: "All classes  were found", data: classes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const class_a = await em.findOneOrFail(
        Class,
        { id },
        { populate: ["classType", "trainer"] }
      ); //class_a porque el nombre de variable class no está permitido
      res.status(200).json({ message: "Class found", data: class_a });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const classType = await em.findOneOrFail(
        ClassType,
        req.body.sanitizedInput.classType
      );
      const trainer = await em.findOneOrFail(
        Trainer,
        req.body.sanitizedInput.trainer
      );
      const class_a = em.create(Class, req.body.sanitizedInput);

      const errors = await validate(class_a);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();

      const days = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ];

      await sendEmail(
        "Gimnasio Iron Haven - Nueva clase disponible",
        `<h3>Nueva clase de ${classType.name}</h3>
        <div>
          <p>Se dictará una nueva clase los días ${
            days[req.body.sanitizedInput.day]
          } de ${req.body.sanitizedInput.startTime} a 
          ${req.body.sanitizedInput.endTime}.</p>
          <p><b>Descripción: </b>${classType.description}</p>
          <p><b>Ubicación: </b>${req.body.sanitizedInput.location}</p>
          <p>La clase estará a cargo de ${
            trainer.firstName + " " + trainer.lastName
          } y cuenta con <b>${
          req.body.sanitizedInput.maxCapacity
        } cupos</b>.</p>
          <p><b>¡Corre a inscribirte antes de que se acaben!</b></p>
        </div>
      `
      );
      res.status(201).json({ message: "Class created", data: class_a });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const class_a = await em.findOneOrFail(Class, { id: req.params.id });
      em.assign(class_a, req.body.sanitizedInput);

      const errors = await validate(class_a);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      if (req.body.sanitizedInput.classType !== undefined)
        await em.findOneOrFail(ClassType, req.body.sanitizedInput.classType);

      if (req.body.sanitizedInput.trainer !== undefined)
        await em.findOneOrFail(Trainer, req.body.sanitizedInput.trainer);

      await em.flush();

      res.status(200).json({ message: "Class updated", data: class_a });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const class_a = em.getReference(Class, id);
      await em.removeAndFlush(class_a);

      res.status(200).json({ message: "Class deleted", data: class_a });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeClass: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      day: req.body.day,
      startTime: req.body.startTime?.trim(),
      endTime: req.body.endTime?.trim(),
      maxCapacity: req.body.maxCapacity,
      location: req.body.location?.trim(),
      active: req.body.active,
      classType: req.body.classType,
      trainer: req.body.trainer,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },

  findAvailableClasses: async function (req: Request, res: Response) {
    const clientId = req.params.clientId; // Suponiendo que el ID del cliente se pasa como un parámetro de la ruta

    try {
      // 1. Obtener todas las clases
      const allClasses = await em.find(Class, {});

      // 2. Obtener todas las inscripciones del cliente específico
      const registrations = await em.find(Registration, {
        client: clientId,
      });

      // 3. Obtener los IDs de las clases a las que el cliente ya está registrado
      const registeredClassIds = registrations.map((reg) => reg.class._id);

      // 4. Filtrar las clases disponibles que no están en las inscripciones del cliente
      const availableClasses = allClasses.filter(
        (cls) => !registeredClassIds.includes(cls._id)
      );

      res.status(200).json({
        message: "Available classes found",
        data: availableClasses,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { controller };
