import { Request, Response, NextFunction } from "express";
import { Client } from "./Client.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const clients = await em.find(Client, {});
      res
        .status(200)
        .json({ message: "All clients were found", data: clients });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const _id = new ObjectId(req.params.id);
      const client = await em.findOneOrFail(Client, { _id });
      res.status(200).json({ message: "Client found", data: client });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const client = em.create(Client, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Client created", data: client });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const _id = new ObjectId(req.params.id);
      const client = await em.findOneOrFail(Client, { _id });
      em.assign(client, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Client updated", data: client });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  remove: async function (req: Request, res: Response) {
    try {
      const _id = new ObjectId(req.params.id);
      const client = em.getReference(Client, _id);
      await em.removeAndFlush(client);
      res.status(200).json({ message: "Client deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeClient: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    //more checks about malicious content, sql injections, data type...

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};

export { controller };
