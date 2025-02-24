import { Request, Response, NextFunction } from "express";
import { startOfDay } from "date-fns";
import { Client } from "../../client/client/client.entity.js";
import { getUser } from "../../auth/auth/auth.controller.js";
import { Membership } from "./membership.entity.js";
import { MembershipType } from "../membership-type/membership-type.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";

const em = orm.em;

const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const memberships = await em.find(
        Membership,
        {},
        { populate: ["type", "client", "payments"] }
      );
      res.status(200).json({
        message: "All memberships were found",
        data: memberships,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membership = await em.findOneOrFail(
        Membership,
        { id },
        { populate: ["type", "client", "payments"] }
      );
      res.status(200).json({ message: "Membership found", data: membership });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  findActiveByClient: async function (req: Request, res: Response) {
    try {
      const client = await getUser(req);
      if (client != null) {
        const clientIdParam = req.params.id;
        const { id } = client;
        if (clientIdParam != id)
          return res.status(401).json({ message: "client unauthorized" });
        const membership = await em.findOneOrFail(
          Membership,
          {
            client: id,
            dateFrom: { $lte: new Date() },
            dateTo: { $gte: new Date() },
          },
          { populate: ["type"] }
        );
        res.status(200).json({ message: "Membership found", data: membership });
      } else {
        return res.status(404).json({ message: "client not found" });
      }
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
      let membership = await em.findOne(Membership, {
        dateTo: { $gt: today },
        client: req.body.sanitizedInput.client,
      }); //revisar que sea la sintaxis correcta

      if (membership === null) {
        membership = em.create(Membership, req.body.sanitizedInput);
      } else {
        membership.type = req.body.sanitizedInput.type; //Si invoco al método "update" se realizan otra vez las validaciones.
      }

      await em.flush();

      res
        .status(201)
        .json({ message: "Membership assigned to client", data: membership });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const membership = await em.findOneOrFail(Membership, {
        id: req.params.id,
      });

      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, { id: req.body.sanitizedInput.client });

      if (req.body.sanitizedInput.type !== undefined)
        await em.findOneOrFail(MembershipType, {
          id: req.body.sanitizedInput.type,
        });

      em.assign(membership, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Membership updated", data: membership });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membership = em.getReference(Membership, id);
      await em.removeAndFlush(membership);
      res.status(200).json({ message: "Membership deleted" });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  },

  sanitizeMembership: function (
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
