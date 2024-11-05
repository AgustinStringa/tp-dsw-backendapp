import { Request, Response, NextFunction } from "express";
import { ClassType } from "./ClassType.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { validate } from "class-validator";
import { Registration } from "./Registration.entity.js";
import { Class } from "./Class.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const classtypes = await em.find(
        ClassType,
        {},
        { populate: ["classes", "classes.trainer"] }
      ); // TO DO: Make sure to populate an related entitites if necessary
      res
        .status(200)
        .json({ message: "All class types were found", data: classtypes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classtype = await em.findOneOrFail(ClassType, { id });
      res.status(200).json({ message: "Class Type found", data: classtype });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const classtype = em.create(ClassType, req.body.sanitizedInput);

      const errors = await validate(classtype);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res.status(201).json({ message: "Class Type created", data: classtype });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classtype = await em.findOneOrFail(ClassType, { id });
      em.assign(classtype, req.body.sanitizedInput);

      const errors = await validate(classtype);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res.status(200).json({ message: "Class Type updated", data: classtype });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classtype = em.getReference(ClassType, id);
      await em.removeAndFlush(classtype);
      res.status(200).json({ message: "Class Type deleted", data: classtype });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeClassType: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },

  findAvailableClassTypes: async function (req: Request, res: Response) {
    const clientId = req.params.clientId;

    try {
      // Obtener todas las inscripciones del cliente
      const registrations = await em.find(Registration, {
        client: clientId,
      });

      // Obtener los IDs de las clases a las que el cliente ya está registrado
      const registeredClassIds = registrations.map((reg) =>
        reg.class._id.toString()
      ); // Asegurarse de que sea un string

      // Obtener todos los tipos de clase con las clases pobladas
      const classTypes = await em.find(
        ClassType,
        {},
        { populate: ["classes", "classes.trainer"] }
      );

      // Filtrar clases de cada tipo de clase para excluir las que ya están registradas
      const filteredClassTypes = classTypes
        .map((classType) => {
          // Filtrar las clases que no están registradas por el cliente
          const availableClasses = classType.classes.filter((cls) => {
            const classId = cls._id.toString(); // Asegurarse de que sea un string
            const isRegistered = registeredClassIds.includes(classId);

            // Depuración
            console.log(
              `Checking class ID: ${classId}, Registered: ${isRegistered}`
            );

            return !isRegistered; // Retornar true si no está registrado
          });

          // Retornar el tipo de clase con las clases filtradas
          return {
            ...classType,
            classes: availableClasses,
          };
        })
        .filter((classType) => classType.classes.length > 0); // Excluir tipos de clase sin clases disponibles

      res.status(200).json({
        message: "Available class types found",
        data: filteredClassTypes,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { controller };
