import { Request, Response } from "express";
import { MembershipTypeRepository } from "./MembershipType.repository.js";
import { MembershipType } from "./MembershipType.entity.js";

const repository = new MembershipTypeRepository();

const controller = {
  findAll: async function (req: Request, res: Response) {
    const data = await repository.findAll();
    res.json({ length: data?.length, data: data });
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const membershipType = await repository.findOne({ id: id });
      if (!membershipType) {
        res.status(404).send({ message: "Membership type not found" });
      } else {
        res.json({ data: membershipType }).status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },

  add: async function (req: Request, res: Response) {
    const { name, description, price } = req.body.sanitizedInput;
    const newMembershipType = await repository.add(
      new MembershipType(name, description, price)
    );
    //another common response is id
    res
      .json({ message: "Membership type created", data: newMembershipType })
      .status(201);
  },

  delete: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const membershipType = await repository.remove({ id: id });

      if (!membershipType) {
        res
          .status(404)
          .send({ message: "Membership type not found" })
          .status(404);
      } else {
        res
          .json({ message: "Membership deleted", data: membershipType })
          .status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      req.body.sanitizedInput.id = req.params.id;
      const membershipType = await repository.update(req.body.sanitizedInput);
      if (!membershipType) {
        res.send({ message: "Membership type not found" }).status(404);
      } else {
        res
          .status(200)
          .send({ message: "Membership updated", data: membershipType });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
};

export { controller };
