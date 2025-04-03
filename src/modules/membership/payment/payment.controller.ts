import { NextFunction, Request, Response } from "express";
import {
  validateEnum,
  validateNumber,
  validateObjectId,
} from "../../../utils/validators/data-type.validators.js";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { Membership } from "../membership/membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Payment } from "./payment.entity.js";
import { PaymentMethodEnum } from "../../../utils/enums/payment-method.enum.js";
import { paymentService } from "./payment.service.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (_req: Request, res: Response) {
    try {
      const payments = await em.find(
        Payment,
        {},
        { populate: ["membership", "membership.client", "membership.type"] }
      );
      res
        .status(200)
        .json(new ApiResponse("Todos los pagos fueron encontrados.", payments));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findByMembership: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.membershipId, "membershipId");
      const payments = await em.find(Payment, { membership: id });

      res
        .status(200)
        .json(
          new ApiResponse(
            "Todos los pagos de la membresía fueron encontrados.",
            payments
          )
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const payment = await em.findOneOrFail(Payment, id!, {
        populate: ["membership"],
      });
      res.status(200).json(new ApiResponse("Pago encontrado.", payment));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const payment = em.create(Payment, req.body.sanitizedInput);
      validateEntity(payment);
      await em.flush();

      await paymentService.updateMembershipDebt(
        req.body.sanitizedInput.membership
      );

      res.status(200).json(new ApiResponse("Pago registrado.", payment));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const input = req.body.sanitizedInput;

      const payment = await em.findOneOrFail(Payment, id!);

      if (payment.paymentMethod === PaymentMethodEnum.STRIPE) {
        res
          .status(403)
          .json(
            new ApiResponse(
              "No se puede modificar un pago realizado con la plataforma Stripe."
            )
          );
        return;
      }

      if (input.membership && input.membership !== payment.membership.id)
        await em.findOneOrFail(Membership, input.membership);

      em.assign(payment, req.body.sanitizedInput);
      validateEntity(payment);
      await em.flush();

      await paymentService.updateMembershipDebt(payment.membership);

      res.status(200).json(new ApiResponse("Pago actualizado.", payment));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = validateObjectId(req.params.id, "id");
      const payment = await em.findOneOrFail(Payment, id!);
      await em.removeAndFlush(payment);

      await paymentService.updateMembershipDebt(payment.membership);

      res.status(200).json(new ApiResponse("Pago eliminado.", payment));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizePayment: function (req: Request, res: Response, next: NextFunction) {
    try {
      const allowUndefined = req.method === "PATCH";

      req.body.sanitizedInput = {
        amount: validateNumber(
          req.body.amount,
          2,
          "amount",
          allowUndefined,
          false
        ),

        membership: validateObjectId(
          req.body.membershipId,
          "membershipId",
          allowUndefined
        ),
        paymentMethod: validateEnum(
          req.body.paymentMethod,
          PaymentMethodEnum,
          "paymentMethod",
          true
        ),
      };

      Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined)
          delete req.body.sanitizedInput[key];
      });

      if (req.body.sanitizedInput.paymentMethod === PaymentMethodEnum.STRIPE) {
        res.status(400).json(new ApiResponse("Método de pago no permitido."));
        return;
      }

      next();
    } catch (error: unknown) {
      handleError(error, res);
    }
  },
};
