import dotenv from "dotenv";
import Stripe from "stripe";
import { NextFunction, Request, Response } from "express";
import { validate } from "class-validator";
import { MembershipType } from "./MembershipType.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";

dotenv.config();

if (!process.env.STRIPE_API_KEY) {
  throw new Error(
    "The Stripe API key is not defined in the environment variables."
  );
}
const stripe = new Stripe(process.env.STRIPE_API_KEY);

const em = orm.em;

const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const membTypes = await em.find(MembershipType, {});

      res.status(200).json({
        message: "All membership types were found",
        data: membTypes,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = await em.findOneOrFail(
        MembershipType,
        { id },
        { populate: ["memberships"] }
      );
      res.status(200).json({
        message: "Type of membership found",
        data: membType,
      });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const membType = em.create(MembershipType, req.body.sanitizedInput);

      const errors = await validate(membType);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();

      //Stripe product
      const product = await stripe.products.create({
        name: membType.name,
        description: membType.description,
        metadata: { custom_id: membType.id },
      });

      const price = await stripe.prices.create({
        unit_amount: membType.price * 100, // en centavos
        currency: "ars",
        product: product.id, //TODO validar que sea el mismo que el de la membresía
      });

      membType.stripePriceId = price.id;
      await em.flush();
      //TODO si falla stripe borrar membType

      res.status(201).json({
        message: "Membership type created",
        data: membType,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const membType = await em.findOneOrFail(MembershipType, req.params.id);
      em.assign(membType, req.body.sanitizedInput);

      const errors = await validate(membType);
      if (errors.length > 0)
        return res.status(400).json({ message: "Bad request" });

      await em.flush();
      res
        .status(200)
        .json({ message: "Membership type updated", data: membType });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = em.getReference(MembershipType, id);
      await em.removeAndFlush(membType);
      res.status(200).json({ message: "Membership type deleted" });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  },

  sanitizeMembershipType: function (
    req: Request,
    res: Response,
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

export { controller };
