import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Registration } from "./Registration.entity.js";
import { Client } from "../Client/Client.entity.js";
import { Class } from "./Class.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (_: Request, res: Response){
    try{
      const registrations = await em.find(Registration, {}, {populate: ["client", "class"]});
      res.status(200).json({ message: "All registrations were found", data: registrations });
    }catch (error: any){
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response){
    try{
      const id = req.params.id;
      const registration = await em.findOneOrFail(Registration, {id}, { populate: ["client", "class"]});
      res.status(200).json({message: "Registration found", data: registration});
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message});
    }
  },

  add: async function (req: Request, res: Response){
    try{
      await em.findOneOrFail(Client, req.body.sanitizedInput.client);
      await em.findOneOrFail(Class, req.body.sanitizedInput.class);
      const registration = em.create(Registration, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Registration created", data: registration});
    } catch (error: any){
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({message: error.message});
    }
  },

  update: async function (req: Request, res: Response){
    try {
      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, req.body.sanitizedInput.client);
      if (req.body.sanitizedInput.class !== undefined)
        await em.findOneOrFail(Class, req.body.sanitizedInput.class);
      const id = req.params.id;
      const registration = await em.findOneOrFail(Registration, id);
      em.assign(registration, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Registration updated", data: registration});
    } catch (error: any){
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message});
    }
  },

  delete: async function (req: Request, res: Response) {
    try { 
      const id = req.params.id;
      const registration = await em.findOneOrFail(Registration, id);
      em.remove(registration);
      await em.flush();
      res.status(200).json({message: "Regsitration deleted", data: registration});
    } catch (error: any){
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message});
    }
  },
  
  sanitizeRegistration: function (req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
      dateTime: req.body.dateTime,
      cancelDateTime: req.body.cancelDateTime,
      client: req.body.client,
      class: req.body.class,
    };
    next();
  },
};

export { controller };