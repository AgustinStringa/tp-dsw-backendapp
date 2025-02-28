import { NextFunction, Request, Response } from "express";
import { handleError } from "../../../utils/errors/error-handler.js";
import { MembershipType } from "./membership-type.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";
import { validateObjectId } from "../../../utils/validators/data-type.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const membTypes = await em.findAll(MembershipType);

      res.status(200).json({
        message: "Todos los tipos de membresías fueron encontrados.",
        data: membTypes,
      });
    } catch (error: any) {
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

      res.status(200).json({
        message: "Tipo de membresía encontrado.",
        data: membType,
      });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const membType = em.create(MembershipType, req.body.sanitizedInput);
      validateEntity(membType);

      await em.flush();
      res.status(201).json({
        message: "Tipo de membresía creado.",
        data: membType,
      });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const membType = await em.findOneOrFail(MembershipType, id!);
      em.assign(membType, req.body.sanitizedInput);
      validateEntity(membType);

      await em.flush();
      res
        .status(200)
        .json({ message: "Tipo de membresía actualizado.", data: membType });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = em.getReference(MembershipType, id);
      await em.removeAndFlush(membType);
      res.status(200).json({ message: "Tipo de membresía eliminado." });
    } catch (error: any) {
      handleError(error, res);
    }
  },

  sanitizeMembershipType: function (
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      name: req.body.name?.trim(),
      description: req.body.description?.trim(),
      price: req.body.price,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });

    next();
  },
};
