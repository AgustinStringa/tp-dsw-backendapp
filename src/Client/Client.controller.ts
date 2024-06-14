import { Request, Response, NextFunction } from "express";
import { Client } from "./Client.entity.js";
import { orm } from "../shared/db/orm.js";

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
    const id = req.params.id;
    /*const client = await repository.findOne({ id });
    if (!client) return res.status(404).send({ message: "Client not found" });

    res.json({ data: client });*/
  },

  add: async function (req: Request, res: Response) {
    try {
      const item = em.create(Client, req.body);
      await em.flush();
      res.status(201).json({ message: "item created", data: item });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }

    /*const input = req.body.sanitizedInput;
    const clientInput = new Client(
      input.username,
      input.password,
      input.email,
      input.firstName,
      input.lastName
    );
    const client = await repository.add(clientInput);
    let client = undefined;

    return res.status(201).send({ message: "Client created", data: client });*/
  },

  update: async function (req: Request, res: Response) {
    req.body.sanitizedInput.id = req.params.id;
    /*const client = await repository.update(req.body.sanitizedInput);

    if (!client) return res.status(404).send({ message: "Client not found" });
    res.send({ message: "Client updated succesfully", data: client });*/
  },

  remove: async function (req: Request, res: Response) {
    const id = req.params.id;
    /*const client = await repository.remove({ id });

    if (!client) return res.status(404).send({ message: "Client not found" });
    res.send({ message: "Client deleted succesfully", data: client });*/
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
