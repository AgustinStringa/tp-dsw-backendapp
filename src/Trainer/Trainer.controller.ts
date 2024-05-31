import { Request, Response } from "express";
import { TrainerRepository } from "./Trainer.repository.js";
import { Trainer } from "./Trainer.entity.js";

const repository = new TrainerRepository();

const controller = {
  findAll: async function (req: Request, res: Response) {
    const data = await repository.findAll();
    res.json({ length: data?.length, data: data });
  },
  findOne: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trainer = await repository.findOne({ id: id });
      if (!trainer) {
        res.status(404).send({ message: "Trainer not found" });
      } else {
        res.json({ data: trainer }).status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
  add: async function (req: Request, res: Response) {
    const { username, password, email, firstName, lastName } =
      req.body.sanitizedInput;
    const newTrainer = await repository.add(
      new Trainer(username, password, email, firstName, lastName)
    );
    //another common response is id
    res.json({ message: "Trainer created", data: newTrainer }).status(201);
  },
  delete: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trainer = await repository.remove({ id: id });

      if (!trainer) {
        res.status(404).send("Trainer not found").status(404);
      } else {
        res.json({ message: "Trainer deleted", data: trainer }).status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      req.body.sanitizedInput.id = req.params.id;
      const trainer = await repository.update(req.body.sanitizedInput);
      if (!trainer) {
        res.send({ message: "Trainer not found" }).status(404);
      } else {
        res.status(200).send({ message: "Trainer updated", data: trainer });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
};

export { controller };
