import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Client } from "../Client/Client.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Trainer } from "./Trainer.entity.js";

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
      const trainer = await em.findOneOrFail(
        Trainer,
        { id },
        {
          populate: [],
        }
      );
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
      const email = req.body.sanitizedInput.email;
      const client = await em.findOne(Client, { email });
      if (client !== null) {
        return res
          .status(409)
          .send({ message: "There is already a client with the same email" });
      }

      const trainer = em.create(Trainer, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Trainer created", data: trainer });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const email = req.body.sanitizedInput.email;
      if (email !== undefined) {
        const client = await em.findOne(Client, { email });
        if (client !== null) {
          return res
            .status(409)
            .send({ message: "There is already a client with the same email" });
        }
      }

      const id = req.params.id;
      const trainer = await em.findOneOrFail(Trainer, { id });
      em.assign(trainer, req.body.sanitizedInput);
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
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      dni: req.body.dni,
      email: req.body.email,
      password: req.body.password,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    if (req.body.sanitizedInput.password) {
      req.body.sanitizedInput.password = bcrypt.hashSync(
        req.body.sanitizedInput.password,
        10
      );
    }

    next();
  },
};

export { controller };
