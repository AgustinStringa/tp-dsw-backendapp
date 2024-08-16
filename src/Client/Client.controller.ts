import { Request, Response, NextFunction } from "express";
import { Client } from "./Client.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import bcrypt from "bcrypt";
const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const clients = await em.find(
        Client,
        {},
        { populate: ["progresses", "goals", "memberships", "routines"] }
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
      await em.flush();
      res.status(201).json({ message: "Client created", data: client });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const client = await em.findOneOrFail(Client, { id });
      em.assign(client, req.body.sanitizedInput);
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

  login: async function (req: Request, res: Response) {
    try {
      const client = await em.findOneOrFail(
        Client,
        { username: req.body.sanitizedInput.username },
        { populate: ["progresses", "goals"] }
      );
      if (client != null) {
        const auth = bcrypt.compareSync(
          req.body.sanitizedInput.password,
          client.password
        );
        if (auth) {
          return res
            .status(200)
            .json({ message: "logged successfully", data: client });
        } else {
          return res
            .status(200)
            .json({ message: "username or password wrong" });
        }
      } else {
        return res.status(404).json({ message: "client not found" });
      }
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

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
  sanitizeLogin: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      username: req.body.username,
      password: req.body.password,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });
    next();
  },
  hashPassword: function (req: Request, res: Response, next: NextFunction) {
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
