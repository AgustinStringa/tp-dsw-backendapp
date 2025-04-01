import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { authService } from "../../auth/auth/auth.service.js";
import { Client } from "../../client/client/client.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { Membership } from "./membership.entity.js";
import { membershipService } from "./membership.service.js";
import { MembershipType } from "../membership-type/membership-type.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Payment } from "../payment/payment.entity.js";
import { paymentService } from "../payment/payment.service.js";
import { startOfDay } from "date-fns";
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

      res
        .status(200)
        .json(
          new ApiResponse(
            "Todas las membresías fueron encontradas.",
            memberships
          )
        );
    } catch (error: unknown) {
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
        .json(new ApiResponse("Membresía encontrada.", membership));
    } catch (error: unknown) {
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
            "debt",
            "type.*",
            "client.id",
            "client.lastName",
            "client.firstName",
            "client.dni",
          ],
        }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            "Todas las membresías activas fueron encontradas.",
            memberships
          )
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOutstandingMemberships: async function (req: Request, res: Response) {
    try {
      const memberships = await em.find(
        Membership,
        { debt: { $gt: 0 } },
        {
          populate: ["client", "type"],
          fields: [
            "dateFrom",
            "dateTo",
            "debt",
            "type.*",
            "client.id",
            "client.lastName",
            "client.firstName",
            "client.dni",
          ],
        }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            "Todas las membresías adeudadas fueron encontradas.",
            memberships
          )
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findActiveByClient: async function (req: Request, res: Response) {
    try {
      const clientIdParam = validateObjectId(req.params.clientId, "clientId");
      const { user } = await authService.getUser(req);

      if (clientIdParam !== user.id)
        return res.status(401).json(new ApiResponse("Cliente no autorizado."));

      const membership = await em.findOne(
        Membership,
        {
          client: user,
          dateFrom: { $lte: new Date() },
          dateTo: { $gt: new Date() },
        },
        { populate: ["type"] }
      );
      if (membership) {
        res
          .status(200)
          .json(new ApiResponse("Membresía encontrada.", membership));
      } else {
        res
          .status(200)
          .json(new ApiResponse("El cliente no tiene una membresía activa."));
      }
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      await em.findOneOrFail(Client, {
        id: req.body.sanitizedInput.client,
      });

      const today = startOfDay(new Date());
      const existingMembership = await em.findOne(Membership, {
        dateTo: { $gt: today },
        client: req.body.sanitizedInput.client,
      });

      if (existingMembership) {
        res
          .status(403)
          .json(new ApiResponse("El cliente posee una membresía activa."));
        return;
      }

      const debt = await membershipService.calcleClientDebt(
        req.body.sanitizedInput.client
      );
      if (debt) {
        res
          .status(403)
          .json(new ApiResponse("El cliente tiene una deuda de $" + debt));
        return;
      }

      const membershipType = await em.findOneOrFail(MembershipType, {
        id: req.body.sanitizedInput.type,
      });

      const membership = em.create(Membership, req.body.sanitizedInput);
      membership.debt = membershipType.price;
      await em.flush();

      res
        .status(201)
        .json(new ApiResponse("Membresía asignada al cliente.", membership));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const input = req.body.sanitizedInput;

      const membership = await em.findOneOrFail(Membership, {
        id,
      });

      if (input.client && input.client !== membership.client.id)
        await em.findOneOrFail(Client, req.body.sanitizedInput.client);

      if (input.type && input.type !== membership.type.id)
        await em.findOneOrFail(MembershipType, req.body.sanitizedInput.type);

      em.assign(membership, req.body.sanitizedInput);
      await em.flush();

      await paymentService.updateMembershipDebt(membership);

      res
        .status(200)
        .json(new ApiResponse("Membresía acualizada.", membership));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membership = em.getReference(Membership, id);
      await em.nativeDelete(Payment, { membership });
      await em.removeAndFlush(membership);

      res.status(200).json(new ApiResponse("Membresía eliminada."));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeMembership: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const allowUndefined = req.method === "PATCH";

      req.body.sanitizedInput = {
        type: validateObjectId(req.body.typeId, "typeId", allowUndefined),
        client: validateObjectId(req.body.clientId, "clientId", allowUndefined),
      };

      Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined)
          delete req.body.sanitizedInput[key];
      });

      next();
    } catch (error: unknown) {
      handleError(error, res);
    }
  },
};
