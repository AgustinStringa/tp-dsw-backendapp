import { Request, Response } from "express";
import { TrainersRepository } from "./Trainers.repository.js";
import { Trainers } from "./Trainers.entity.js";

const repository = new TrainersRepository();

const controller = {
  findAll: async function (req: Request, res: Response) {
    const data = await repository.findAll();
    res.json({ length: data?.length, data: data });
  },
  findOne: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const Trainers = await repository.findOne({ id: id });
      if (!Trainers) {
        res.status(404).send({ message: "Trainer type not found" });
      } else {
        res.json({ data: Trainers }).status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
  add: async function (req: Request, res: Response) {
    const { username, password, email, firstName, lastName } = req.body.sanitizedInput;
    const newTrainers = await repository.add(
      new Trainers(username, password, email, firstName, lastName)
    );
    //another common response is id
    res
      .json({ message: "Trainer type created", data: newTrainers })
      .status(201);
  },
  delete: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const Trainers = await repository.remove({ id: id });

      if (!Trainers) {
        res.status(404).send("Trainer type not found").status(404);
      } else {
        res
          .json({ message: "Trainer deleted", data: Trainers })
          .status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      req.body.sanitizedInput.id = req.params.id;
      const Trainers = await repository.update(req.body.sanitizedInput);
      if (!Trainers) {
        res.send({ message: "Trainer type not found" }).status(404);
      } else {
        res
          .status(200)
          .send({ message: "Trainer updated", data: Trainers });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
};

export { controller };
