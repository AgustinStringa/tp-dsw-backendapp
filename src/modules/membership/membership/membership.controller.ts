import { Request, Response, NextFunction } from "express";
import { startOfDay } from "date-fns";
import { authService } from "../../auth/auth/auth.service.js";
import { Client } from "../../client/client/client.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { Membership } from "./membership.entity.js";
import { MembershipType } from "../membership-type/membership-type.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateObjectId } from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const memberships = await em.find(
        Membership,
        {},
        { populate: ["type", "client", "payments"] }
      );
      res.status(200).json({
        message: "Todas las membresías fueron encontradas.",
        data: memberships,
      });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const membership = await em.findOneOrFail(
        Membership,
        { id },
        { populate: ["type", "client", "payments"] }
      );

      res
        .status(200)
        .json({ message: "Membresía encontrada.", data: membership });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  findActive: async function (_req: Request, res: Response) {
    try {
      const today = startOfDay(new Date());

      const memberships = await em.find(
        Membership,
        { dateFrom: { $lte: today }, dateTo: { $gt: today } },
        {
          populate: ["client", "type"],
          fields: [
            "dateFrom",
            "dateTo",
            "type.*",
            "client.id",
            "client.lastName",
            "client.firstName",
            "client.dni",
          ],
        }
      );

      return res.status(200).json({
        message: "Todas las membresías activas fueron encontradas.",
        data: memberships,
      });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  findActiveByClient: async function (req: Request, res: Response) {
    try {
      const clientIdParam = validateObjectId(req.params.id, "clientId");
      const { user } = await authService.getUser(req);

      if (clientIdParam !== user.id)
        return res.status(401).json({ message: "Cliente no autorizado." });

      const membership = await em.findOneOrFail(
        Membership,
        {
          client: user,
          dateFrom: { $lte: new Date() },
          dateTo: { $gt: new Date() },
        },
        { populate: ["type"] }
      );

      res
        .status(200)
        .json({ message: "Membresía encontrada.", data: membership });
    } catch (error: any) {
      handleError(error, res);
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
      });

      if (membership === null)
        membership = em.create(Membership, req.body.sanitizedInput);
      else membership.type = req.body.sanitizedInput.type;

      await em.flush();

      res
        .status(201)
        .json({ message: "Membresía asignada al cliente.", data: membership });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const membership = await em.findOneOrFail(Membership, {
        id: req.params.id,
      });

      if (req.body.sanitizedInput.client !== undefined)
        await em.findOneOrFail(Client, req.body.sanitizedInput.client);

      if (req.body.sanitizedInput.type !== undefined)
        await em.findOneOrFail(MembershipType, req.body.sanitizedInput.type);

      em.assign(membership, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: "Membresía acualizada.", data: membership });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membership = em.getReference(Membership, id);
      await em.removeAndFlush(membership);
      res.status(200).json({ message: "Membresía eliminada." });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  sanitizeMembership: function (
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      type: validateObjectId(req.body.typeId, "typeId"),
      client: validateObjectId(req.body.clientId, "clientId"),
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });

    next();
  },
};
