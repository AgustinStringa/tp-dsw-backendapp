import { NextFunction, Request, Response } from "express";
import {
  validateNumber,
  validateObjectId,
} from "../../../utils/validators/data-type.validators.js";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { environment } from "../../../config/env.config.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { MembershipType } from "./membership-type.entity.js";
import { membershipTypeService } from "./membership-type.service.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import Stripe from "stripe";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;
const stripe = new Stripe(environment.stripe.apiKey as string);

export const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const membTypes = await em.findAll(MembershipType, {
        orderBy: { name: "asc" },
      });

      res
        .status(200)
        .json(
          new ApiResponse(
            "Todos los tipos de membresías fueron encontrados.",
            membTypes
          )
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const membType = await em.findOneOrFail(
        MembershipType,
        { id },
        { populate: ["memberships"] }
      );

      res
        .status(200)
        .json(new ApiResponse("Tipo de membresía encontrado.", membType));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const membType = em.create(MembershipType, req.body.sanitizedInput);
      validateEntity(membType);

      await membershipTypeService.createStripeProduct(membType);
      await membershipTypeService.createStripePrice(membType);
      await em.flush();

      res
        .status(201)
        .json(new ApiResponse("Tipo de membresía creado.", membType));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const membType = await em.findOneOrFail(MembershipType, id!);
      const oldPrice = membType.price;

      em.assign(membType, req.body.sanitizedInput);
      validateEntity(membType);

      if (oldPrice !== membType.price) {
        membershipTypeService.archiveStripePrice(membType);
        await membershipTypeService.createStripePrice(membType);
      }
      await em.flush();

      res
        .status(200)
        .json(new ApiResponse("Tipo de membresía actualizado.", membType));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = await em.findOneOrFail(MembershipType, id);

      await stripe.products.update(membType.stripeId, {
        active: false,
      });

      await em.removeAndFlush(membType);
      res.status(200).json(new ApiResponse("Tipo de membresía eliminado."));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeMembershipType: function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const allowUndefined = req.method === "PATCH";

      req.body.sanitizedInput = {
        name: req.body.name?.trim(),
        description: req.body.description?.trim(),
        price: validateNumber(
          req.body.price,
          2,
          "price",
          allowUndefined,
          false
        ),
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
