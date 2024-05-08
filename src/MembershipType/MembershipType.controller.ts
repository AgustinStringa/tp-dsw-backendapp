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
      const membershiptype = await repository.findOne({ id: id });
      if (!membershiptype) {
        res.status(404).send({ message: "membership type not found" });
      } else {
        res.json({ data: membershiptype }).status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
  add: async function (req: Request, res: Response) {
    const { name, description, price, updated_to } = req.body.sanitizedInput;
    const newMembershipType = await repository.add(
      new MembershipType(name, description, price, new Date(updated_to))
    );
    //another common response is id
    res
      .json({ message: "membership type created", data: newMembershipType })
      .status(201);
  },
  delete: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const membershiptype = await repository.remove({ id: id });

      if (!membershiptype) {
        res.status(404).send("membership type not found").status(404);
      } else {
        res
          .json({ message: "membership deleted", data: membershiptype })
          .status(200);
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
  update: async function (req: Request, res: Response) {
    try {
      req.body.sanitizedInput.id = req.params.id;
      const membershiptype = await repository.update(req.body.sanitizedInput);
      if (!membershiptype) {
        res.send({ message: "membership type not found" }).status(404);
      } else {
        res
          .status(200)
          .send({ message: "membership updated", data: membershiptype });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  },
};

export { controller };
