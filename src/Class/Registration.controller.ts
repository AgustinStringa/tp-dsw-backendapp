import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Class } from "./Class.entity.js";
import { Client } from "../Client/Client.entity.js";
import { getUser } from "../Auth/Auth.controller.js";
import { Registration } from "./Registration.entity.js";

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
      const id = req.params.id;
      const registrations = await em.find(Registration, { client: id });

      res.status(200).json({
        message: "Registrations for the client were found",
        data: registrations,
      });
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

      const registrationVa = await em.findOne(Registration, {
        client: req.body.sanitizedInput.client,
        class: req.body.sanitizedInput.class,
      });

      if (registrationVa !== null) {
        res
          .status(409)
          .json({ message: "The client is already enrolled in the class" });
      } else {
        const registration = em.create(Registration, req.body.sanitizedInput);
        await em.flush();
        res
          .status(201)
          .json({ message: "Registration created", data: registration });
      }
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, req.body.sanitizedInput.client);
      if (req.body.sanitizedInput.class !== undefined) {
        await em.findOneOrFail(Class, {
          id: req.body.sanitizedInput.class,
          active: true,
        });
      }

      const id = req.params.id;
      const registration = await em.findOneOrFail(Registration, id);
      em.assign(registration, req.body.sanitizedInput);
      registration.checkCancelDateTime();
      await em.flush();

      res
        .status(200)
        .json({ message: "Registration updated", data: registration });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const registration = em.getReference(Registration, id);
      await em.removeAndFlush(registration);
      res
        .status(200)
        .json({ message: "Registration deleted", data: registration });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeRegistration: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      cancelDateTime: req.body.cancelDateTime,
      client: req.body.client,
      class: req.body.class,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    try {
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
