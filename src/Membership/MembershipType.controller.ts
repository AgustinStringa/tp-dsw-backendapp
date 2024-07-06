import { NextFunction, Request, Response } from "express";
import { MembershipType } from "./MembershipType.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";

const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const membTypes = await em.find(
        MembershipType,
        {},
        { populate: ["memberships"] }
      );
      res.status(200).json({
        message: "All types of membership  were found",
        data: membTypes,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = await em.findOneOrFail(
        MembershipType,
        { id },
        { populate: ["memberships"] }
      );
      res.status(200).json({
        message: "Type of membership found",
        data: membType,
      });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const membType = em.create(MembershipType, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({
        message: "Type of membership created",
        data: membType,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = await em.findOneOrFail(MembershipType, { id });
      em.assign(membType, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: "Membership type updated", data: membType });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = em.getReference(MembershipType, id);
      await em.removeAndFlush(membType);
      res.status(200).json({ message: "Membership type deleted" });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  },

  sanitizeMembershipType: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });
    next();
  },
};

export { controller };
