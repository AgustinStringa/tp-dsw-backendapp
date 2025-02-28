import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Client } from "./client.entity.js";
import { authService } from "../../auth/auth/auth.service.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { sendEmail } from "../../../utils/notifications/notifications.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const clients = await em.findAll(Client, {
        fields: ["lastName", "firstName", "dni", "email"],
        orderBy: { lastName: "asc", firstName: "asc" }, //es sensible a mayúsculas y minúsculas
      });

      res.status(200).json({
        message: "Todos los clientes fueron encontrados.",
        data: clients,
      });
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
      res.status(200).json({ message: "Cliente encontrado.", data: client });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const client = em.create(Client, req.body.sanitizedInput);
      validateEntity(client);

      const trainer = await em.findOne(Trainer, { email: client.email });
      if (trainer !== null) {
        return res
          .status(409)
          .send({ message: "El correo electrónico ya se encuentra en uso." });
      }

      let token;
      try {
        token = authService.decodeToken(req);
      } catch (error: any) {}

      if (token === undefined) {
        authService.startSession(res, client);
      }

      await em.flush();

      sendEmail(
        "Registro exitoso en Gimnasio Iron Haven",
        `
        <h3>Felicitaciones. El registro en nuestra app se realizó exitosamente.</h3>
        <div>
        <p>Correo electrónico: ${req.body.sanitizedInput.email} (con él podrás iniciar sesión en nuestro sitio).</p>
        <p>Ahora puedes disfrutar de las funcionalidades de inscribirte a una clase, leer nuestras noticias y registrar tus progresos en el gimnasio.</p>
        <p>¡Más funcionalidades en construcción!</p>
        <p>¡Dirígite a nuestro <a href="https://www.ironheavengym.com.ar/">sitio web</a> para comenzar!</p>
        </div>
        <div style="color: #FF5733; font-size: 16px; font-weight: bold;">
    Gimnasio Iron Haven
</div>
      `,
        [req.body.sanitizedInput.email]
      );

      const userReturn = {
        firstName: client.firstName,
        lastName: client.lastName,
        dni: client.dni,
        email: client.email,
        isClient: true,
      };

      return res.status(201).json({
        message: "Cliente registrado.",
        data: { user: userReturn },
      });
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
            message: "El correo electrónico ya se encuentra en uso.",
          });
        }
      }

      const id = req.params.id;
      const client = await em.findOneOrFail(Client, { id });
      em.assign(client, req.body.sanitizedInput);

      validateEntity(client);

      await em.flush();
      res.status(200).json({ message: "Cliente actualizado.", data: client });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const client = em.getReference(Client, id);
      await em.removeAndFlush(client);
      res.status(200).json({ message: "Cliente eliminado." });
    } catch (error: any) {
      handleError(error, res);
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
