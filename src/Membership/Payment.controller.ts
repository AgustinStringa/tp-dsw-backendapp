import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Payment } from "./Payment.entity.js";
import { CurrentMembership } from "./CurrentMembership.entity.js";

const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const payments = await em.find(
        Payment,
        {},
        { populate: ["membership", "membership.client", "membership.type"] }
      );
      res
        .status(200)
        .json({ message: "All payments were founnd", data: payments });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const payment = await em.findOneOrFail(Payment, id, {
        populate: ["membership"],
      });
      res.status(200).json({ message: "Payment found", data: payment });
    } catch (error: any) {
      res.status(500).send({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const id = req.body.sanitizedInput.membership;
      await em.findOneOrFail(CurrentMembership, { id });

      const payment = em.create(Payment, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Payment created", data: payment });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const payment = await em.findOneOrFail(Payment, { id });
      if (req.body.sanitizedInput.membership !== undefined)
        await em.findOneOrFail(
          CurrentMembership,
          req.body.sanitizedInput.membership
        );

      em.assign(payment, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: "Payment updated", data: payment });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const payment = em.getReference(Payment, id);
      await em.removeAndFlush(payment);
      res.status(200).json({ message: "Payment deleted", data: payment });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizePayment: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      payMethod: req.body.payMethod,
      amount: req.body.amount,
      membership: req.body.membership,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });

    next();
  },
};

export { controller };
