import { Request, Response, Router } from "express";
import { ClientRepository } from "./Client.repository.js";
import { Client } from "./Client.entity.js";

const repository = new ClientRepository();

const controller = {
  findAll: async function (_: Request, res: Response) {
    res.json({ data: await repository.findAll() });
  },

  findOne: async function (req: Request, res: Response) {
    const id = req.params.id;
    const client = await repository.findOne({ id });
    if (!client) return res.status(404).send({ message: "Client not found" });

    res.json({ data: client });
  },

  add: async function (req: Request, res: Response) {
    const input = req.body.sanitizedInput;
    const clientInput = new Client(
      input.username,
      input.password,
      input.email,
      input.firstName,
      input.lastName
    );
    const client = await repository.add(clientInput);
    return res.status(201).send({ message: "Client created", data: client });
  },

  update: async function (req: Request, res: Response) {
    req.body.sanitizedInput.id = req.params.id;
    const client = await repository.update(req.body.sanitizedInput);

    if (!client) return res.status(404).send({ message: "Client not found" });
    res.send({ message: "Client updated succesfully", data: client });
  },

  remove: async function (req: Request, res: Response) {
    const id = req.params.id;
    const client = await repository.remove({ id });

    if (!client) return res.status(404).send({ message: "Client not found" });
    res.send({ message: "Client deleted succesfully", data: client });
  },
};

export { controller };
