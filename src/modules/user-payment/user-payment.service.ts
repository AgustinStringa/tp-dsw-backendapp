import Stripe from "stripe";
import { environment } from "../../config/env.config.js";
import { Membership } from "../membership/membership/membership.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Payment } from "../membership/payment/payment.entity.js";
import { PaymentStatusEnum } from "../../utils/enums/payment-status.enum.js";

const em = orm.em;
const stripe = new Stripe(environment.stripe.apiKey as string);

export const userPaymentService = {
  fulfillCheckout: async (sessionId: any) => {
    try {
      const payment = await em.findOne(Payment, {
        status: { $ne: PaymentStatusEnum.PAID },
        stripe: { sessionId: sessionId },
      });

      if (payment === null) return;

      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ["line_items"],
          // En el negocio, las compras son para una sola membresía
        }
      );

      em.assign(payment, {
        status: checkoutSession.payment_status as PaymentStatusEnum,
        stripe: {
          checkoutStatus: checkoutSession.status,
          paymentIntent: checkoutSession.payment_intent as string,
        },
      });

      if (checkoutSession.payment_status === "paid") {
        const membership = await em.findOneOrFail(
          Membership,
          payment.membership
        );
        membership.debt = 0;

        //TODO send receipt to client
      }

      em.flush();
    } catch (error: any) {
      throw error;
    }
  },
};
