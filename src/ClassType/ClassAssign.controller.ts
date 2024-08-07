import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { ClassAssign } from "./ClassAssign.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response)  {
    try {
      const classAssigns = await em.find(
        ClassAssign, 
        {}, 
        { populate: ["clients", "classList"]}
      );
      res
        .status(200)
        .json({ message: "All class assign were found", data: classAssigns})
    } catch (error: any){
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try{
      const id = req.params.id;
      const classAssign = await em.findOneOrFail(
        ClassAssign,
        { id },
        { populate: ["clients", "classList"] }
      );
      res.status(200).json({ message: "Class Assign found", data: classAssign });
    } catch (error: any){
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }  
  },

  add: async function (req: Request, res: Response) {
    try {
      const classAssign = em.create(ClassAssign, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Class Assign created", data: classAssign });
    } catch (error: any) {
      res.status(500).json({ message: error.message});
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const classAssign = em.getReference(ClassAssign, id);
      await em.removeAndFlush(classAssign);
      res.status(200).json({ message: "Class Assign deleted"});
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizedClassAssign: function (req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
      dateAssigned: req.body.dateAssigned,
      //clients?, classList?
    };

    Object.keys(req.body.sanitizedInput).forEach((key)=>{
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },

};

export { controller };