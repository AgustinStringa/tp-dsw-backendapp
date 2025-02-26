import { NextFunction, Request, Response } from "express";
import { authService } from "../../auth/auth/auth.service.js";
import { Class } from "../class/class.entity.js";
import { Client } from "../../client/client/client.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Registration } from "./registration.entity.js";
import { validateObjectId } from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const registrations = await em.find(
        Registration,
        { cancelDateTime: null },
        { populate: ["client", "class"] }
      );
      res.status(200).json({
        message: "Todas las inscripciones activas fueron encontradas.",
        data: registrations,
      });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const registration = await em.findOneOrFail(
        Registration,
        { id },
        { populate: ["client", "class"] }
      );
      res
        .status(200)
        .json({ message: "Inscripción encontrada.", data: registration });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  findByClient: async function (req: Request, res: Response) {
    try {
      const clientIdParam = req.params.id;
      const { user } = await authService.getUser(req);

      if (clientIdParam !== user.id)
        return res.status(401).json({ message: "Cliente no autorizado." });

      const registrations = await em.find(Registration, { client: user.id });
      res.status(200).json({
        message: "Las inscripciones del cliente fueron encontradas.",
        data: registrations,
      });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Client, req.body.sanitizedInput.client);
      const chosenClass = await em.findOneOrFail(Class, {
        id: req.body.sanitizedInput.class,
        active: true,
      });

      const existingRegistration = await em.findOne(Registration, {
        client: req.body.sanitizedInput.client,
        class: chosenClass,
        cancelDateTime: null,
      });

      if (existingRegistration) {
        res.status(400).json({
          message: "El cliente ya se encuentra inscripto en la clase.",
        });
        return;
      }

      const registrationsCount = await em.count(Registration, {
        class: chosenClass,
        cancelDateTime: null,
      });

      if (registrationsCount >= chosenClass.maxCapacity) {
        res
          .status(409)
          .json({ message: "No hay más cupos en la clase seleccionada." });
        return;
      }

      const registration = em.create(Registration, req.body.sanitizedInput);
      await em.flush();

      res
        .status(201)
        .json({ message: "Inscripción registrada.", data: registration });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  cancel: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const registration = await em.findOneOrFail(Registration, {
        id,
        cancelDateTime: null,
      });

      const { user, isTrainer } = await authService.getUser(req);

      if (isTrainer === false && user !== registration.client) {
        res.status(401).json({ message: "Cliente no autorizado." });
        return;
      }

      registration.cancelDateTime = new Date();
      await em.flush();

      res
        .status(200)
        .json({ message: "Inscripción cancelada.", data: registration });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  sanitizeRegistration: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      req.body.sanitizedInput = {
        client: validateObjectId(req.body.client_id, "client_id"),
        class: validateObjectId(req.body.class_id, "class_id"),
      };

      Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key];
        }
      });

      const { user, isTrainer } = await authService.getUser(req);

      if (isTrainer === false) req.body.sanitizedInput.client = user.id;

      next();
    } catch (error: any) {
      handleError(error, res);
    }
  },
};

export { controller };
