import { Request, Response, NextFunction } from "express";
import { CurrentMembership } from "./CurrentMembership.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Client } from "../Client/Client.entity.js";
import { MembershipType } from "./MembershipType.entity.js";
import { startOfDay } from "date-fns";

const em = orm.em;

const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const currentMembs = await em.find(
        CurrentMembership,
        {},
        { populate: ["type", "client", "payments"] }
      );
      res.status(200).json({
        message: "All current memberships were found",
        data: currentMembs,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const currentMemb = await em.findOneOrFail(
        CurrentMembership,
        { id },
        { populate: ["type", "client", "payments"] }
      );
      res
        .status(200)
        .json({ message: "Current membership found", data: currentMemb });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Client, {
        id: req.body.sanitizedInput.client,
      });

      await em.findOneOrFail(MembershipType, {
        id: req.body.sanitizedInput.type,
      });

      const today = startOfDay(new Date());
      let currentMemb = await em.findOne(CurrentMembership, {
        dateTo: { $gt: today },
        client: req.body.sanitizedInput.client,
      }); //revisar que sea la sintaxis correcta

      if (currentMemb === null) {
        currentMemb = em.create(CurrentMembership, req.body.sanitizedInput);
      } else {
        currentMemb.type = req.body.sanitizedInput.type; //Si invoco al método "update" se realizan otra vez las validaciones.
      }

      await em.flush();

      res
        .status(201)
        .json({ message: "Membership assigned to client", data: currentMemb });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const currentMemb = await em.findOneOrFail(CurrentMembership, {
        id: req.params.id,
      });

      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, { id: req.body.sanitizedInput.client });

      if (req.body.sanitizedInput.type !== undefined)
        await em.findOneOrFail(MembershipType, {
          id: req.body.sanitizedInput.type,
        });

      em.assign(currentMemb, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: "Current membership updated", data: currentMemb });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const currentMemb = em.getReference(CurrentMembership, id);
      await em.removeAndFlush(currentMemb);
      res.status(200).json({ message: "Current membership deleted" });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  },

  sanitizeCurrentMembership: function (
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      type: req.body.type,
      client: req.body.client,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });

    next();
  },
};

export { controller };
