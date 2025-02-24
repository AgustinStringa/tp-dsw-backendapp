import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { ClassType } from "./class-type.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const classtypes = await em.find(
        ClassType,
        {},
        { populate: ["classes", "classes.trainer"] }
      ); // TODO: Make sure to populate an related entitites if necessary
      res
        .status(200)
        .json({ message: "All class types were found", data: classtypes });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classtype = await em.findOneOrFail(ClassType, { id });
      res.status(200).json({ message: "Class Type found", data: classtype });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const classtype = em.create(ClassType, req.body.sanitizedInput);

      const errors = await validate(classtype);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res.status(201).json({ message: "Class Type created", data: classtype });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classtype = await em.findOneOrFail(ClassType, { id });
      em.assign(classtype, req.body.sanitizedInput);

      const errors = await validate(classtype);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res.status(200).json({ message: "Class Type updated", data: classtype });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classtype = em.getReference(ClassType, id);
      await em.removeAndFlush(classtype);
      res.status(200).json({ message: "Class Type deleted", data: classtype });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeClassType: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },
};

export { controller };
