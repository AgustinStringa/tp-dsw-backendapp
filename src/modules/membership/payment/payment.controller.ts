import { Request, Response, NextFunction } from "express";
import { Membership } from "../membership/membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Payment } from "./payment.entity.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

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
        .json({ message: "All payments were found", data: payments });
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
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const payment = em.create(Payment, req.body.sanitizedInput);
      validateEntity(payment);

      await em.findOneOrFail(Membership, payment.membership.id);

      await em.flush();
      res.status(200).json({ message: "Payment created", data: payment });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const payment = await em.findOneOrFail(Payment, req.params.id);
      em.assign(payment, req.body.sanitizedInput);
      validateEntity(payment);

      if (req.body.sanitizedInput.membership !== undefined)
        await em.findOneOrFail(Membership, req.body.sanitizedInput.membership);

      await em.flush();
      res.status(200).json({ message: "Payment updated", data: payment });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
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
      paymentMethod: req.body.paymentMethod?.trim(),
      amount: req.body.amount,
      membership: req.body.membership,
      status: req.body.status,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });

    next();
  },
};

export { controller };
