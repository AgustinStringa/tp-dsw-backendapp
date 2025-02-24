import { NextFunction, Request, Response } from "express";
import { Class } from "../class/class.entity.js";
import { Client } from "../../client/client/client.entity.js";
import { getUser } from "../../auth/auth/auth.controller.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Registration } from "./registration.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const registrations = await em.find(
        Registration,
        {},
        { populate: ["client", "class"] }
      );
      res
        .status(200)
        .json({ message: "All registrations were found", data: registrations });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
        .json({ message: "Registration found", data: registration });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  findByClient: async function (req: Request, res: Response) {
    try {
      const user = await getUser(req);
      if (user != null) {
        const clientIdParam = req.params.id;
        const { id } = user;
        if (clientIdParam != id)
          return res.status(401).json({ message: "client unauthorized" });
        const registrations = await em.find(Registration, { client: id });
        res.status(200).json({
          message: "Registrations for the client were found",
          data: registrations,
        });
      } else {
        return res.status(404).json({ message: "client not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Client, req.body.sanitizedInput.client);
      await em.findOneOrFail(Class, {
        id: req.body.sanitizedInput.class,
        active: true,
      });

      const existingRegistration = await em.findOne(Registration, {
        client: req.body.sanitizedInput.client,
        class: req.body.sanitizedInput.class,
        cancelDateTime: null, //TODO ver si es lo mismo que undefeinces
      });

      if (existingRegistration) {
        res
          .status(409)
          .json({ message: "The client is already enrolled in the class" });
        return;
      }

      //buscar cupo y contar inscripciones activas
      const registration = em.create(Registration, req.body.sanitizedInput);
      await em.flush();
      res
        .status(201)
        .json({ message: "Registration created.", data: registration });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  cancel: async function (req: Request, res: Response) {
    try {
      //TODO verificar que la registration se trate del cliente
      const id = req.params.id;
      const registration = await em.findOneOrFail(Registration, id);

      registration.cancelDateTime = new Date();
      await em.flush();

      res
        .status(200)
        .json({ message: "Registration cancelled.", data: registration });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  sanitizeRegistration: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      client: req.body.client,
      class: req.body.class,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    try {
      //TODO ver en el cancel que se verifique esto
      const user = await getUser(req);

      if (user !== null) {
        if (user.isTrainer === false) req.body.sanitizedInput.client = user.id;

        next();
      } else {
        res.status(500).json({ message: "Try again please" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { controller };
