import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { ClassList } from "./ClassList.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response) {
    try {
      const classLists = await em.find(ClassList, {}, { populate: ["classType", "trainer"] }); // QUESTION: Should we populate also with "ClassAssigned?"
      res.status(200).json({ message: "All class lists were found", data: classLists });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classList = await em.findOneOrFail(
        ClassList,
        { id },
        { populate: ["classType", "trainer"] }
      );
      res.status(200).json({ message: "Class list found", data: classList });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(ClassList, req.body.sanitizedInput.classType);
      await em.findOneOrFail(ClassList, req.body.sanitizedInput.trainer);
      const classList = em.create(ClassList, req.body.sanitizedInput);
      await em.flush();

      res.status(201).json({ message: "Class list created", data: classList });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      if (req.body.sanitizedInput.classType !== undefined)
        await em.findOneOrFail(ClassList, req.body.sanitizedInput.classType);

      if (req.body.sanitizedInput.trainer !== undefined)
        await em.findOneOrFail(ClassList, req.body.sanitizedInput.trainer);

      const id = req.params.id;
      const classList = await em.findOneOrFail(ClassList, id);
      em.assign(classList, req.body.sanitizedInput);
      await em.flush();

      res.status(200).json({ message: "Class list updated", data: classList });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classList = await em.findOneOrFail(ClassList, id);
      em.remove(classList);
      await em.flush();

      res.status(200).json({ message: "Class list deleted", data: classList });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  sanitizeClassList: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      classHour: req.body.classHour,
      classDay: req.body.classDay,
      state: req.body.state,
      classType: req.body.classType,
      trainer: req.body.trainer,
    };
    next();
  },


};

export { controller };