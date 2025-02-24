import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { Client } from "../../client/client/client.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Trainer } from "./trainer.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const trainers = await em.find(Trainer, {});
      res.json({ message: "All Trainers were found", data: trainers });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const trainer = await em.findOneOrFail(Trainer, { id });
      if (!trainer) {
        res.status(404).send({ message: "Trainer not found" });
      } else {
        res.json({ data: trainer }).status(200);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const trainer = em.create(Trainer, req.body.sanitizedInput);

      const errors = await validate(trainer);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      const client = await em.findOne(Client, { email: trainer.email });
      if (client !== null) {
        return res
          .status(409)
          .send({ message: "There is already a client with the same email" });
      }

      await em.flush();
      res.status(201).json({ message: "Trainer created", data: trainer });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const trainer = await em.findOneOrFail(Trainer, { id: req.params.id });
      em.assign(trainer, req.body.sanitizedInput);

      const errors = await validate(trainer);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      if (req.body.sanitizedInput.email !== undefined) {
        const client = await em.findOne(Client, { email: trainer.email });
        if (client !== null) {
          return res
            .status(409)
            .send({ message: "There is already a client with the same email" });
        }
      }

      await em.flush();
      res.status(200).json({ message: "Trainer updated", data: trainer });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const trainer = em.getReference(Trainer, id);
      await em.removeAndFlush(trainer);
      res.status(200).json({ message: "Trainer deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeTrainer: function (req: Request, _: Response, next: NextFunction) {
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
