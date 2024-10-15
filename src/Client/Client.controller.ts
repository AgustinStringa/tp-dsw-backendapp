import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Client } from "./Client.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Notifications/Notifications.js";

const JWT_SECRET = "your_jwt_secret";
const em = orm.em;

const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const clients = await em.find(
        Client,
        {},
        {
          populate: ["progresses", "goals", "memberships", "routines"],
          fields: ["lastName", "firstName", "dni", "email"],
        } //parametrizar filtros según requerimientos
      );
      res
        .status(200)
        .json({ message: "All clients were found", data: clients });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const client = await em.findOneOrFail(
        Client,
        { id },
        { populate: ["progresses", "goals"] }
      );
      res.status(200).json({ message: "Client found", data: client });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const client = em.create(Client, req.body.sanitizedInput);
      const errors = await validate(client);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      const trainer = await em.findOne(Trainer, { email: client.email });
      if (trainer !== null) {
        return res
          .status(409)
          .send({ message: "There is already a trainer with the same email" });
      }

      await em.flush();
      const token = jwt.sign({ id: client.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      //enviar email?
      sendEmail(
        "Registro exitoso en AppGimnasio",
        `
        <h1>Felicitaciones. El registro en la App se realizo exitosamente.</h1>
        <div>
        <h2>${req.body.sanitizedInput.email} es el correo con el que deberás iniciar sesión cada vez que ingreses a nuestro sitio</h2>
        <p>Ahora puedes disfrutar de las funcionalidades de inscribirte a una clase, enterarte de nuestras noticias y registrar tus progresos en el gimnasio.</p>
        <p>¡Más funcionalidades en construcción!</p>
        <p>¡Dirígite a nuestro <a href="https://www.mundogymcentro.com.ar/">sitio web</a> para comenzar!</p>
        </div>
      `,
        [req.body.sanitizedInput.email]
      );
      return res.status(201).json({
        message: "Register successfully",
        data: { user: client, client: true, token },
      }); //no debería devolver la contraseña
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const email = req.body.sanitizedInput.email;
      if (email !== undefined) {
        const trainer = await em.findOne(Trainer, { email });
        if (trainer !== null) {
          return res.status(409).send({
            message: "There is already a trainer with the same email",
          });
        }
      }

      const id = req.params.id;
      const client = await em.findOneOrFail(Client, { id });
      em.assign(client, req.body.sanitizedInput);

      const errors = await validate(client);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res.status(200).json({ message: "Client updated", data: client });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const client = em.getReference(Client, id);
      await em.removeAndFlush(client);
      res.status(200).json({ message: "Client deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeClient: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      lastName: req.body.lastName?.trim(),
      firstName: req.body.firstName?.trim(),
      dni: req.body.dni?.toString().trim(),
      email: req.body.email?.trim(),
      password: req.body.password,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    if (req.body.sanitizedInput.password) {
      if (req.body.sanitizedInput.password.length >= 4) {
        req.body.sanitizedInput.password = bcrypt.hashSync(
          req.body.sanitizedInput.password,
          10
        );
      } else {
        req.body.sanitizedInput.password = "";
      }
    }

    next();
  },
};

export { controller };
