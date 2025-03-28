import { environment } from "../../config/env.config.js";
import { Membership } from "../membership/membership/membership.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Payment } from "../membership/payment/payment.entity.js";
import { PaymentMethodEnum } from "../../utils/enums/payment-method.enum.js";
import { PaymentStatusEnum } from "../../utils/enums/payment-status.enum.js";
import { startOfDay } from "date-fns";
import Stripe from "stripe";
import { StripePaymentIntent } from "./stripe-payment-intent.entity.js";

const em = orm.em;
const stripe = new Stripe(environment.stripe.apiKey as string);

export const userPaymentService = {
  fulfillCheckout: async (sessionId: string) => {
    const stripePayment = await em.findOne(StripePaymentIntent, {
      sessionId: sessionId,
      status: { $ne: PaymentStatusEnum.PAID },
    });

    if (stripePayment === null) return;

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
      // En el negocio, las compras son para una sola membresía
    });

    em.assign(stripePayment, {
      status: checkoutSession.payment_status as PaymentStatusEnum,
      paymentIntent: checkoutSession.payment_intent as string,
      checkoutStatus: checkoutSession.status,
    });

    if (checkoutSession.payment_status === "paid") {
      await userPaymentService.registerPayment(stripePayment, checkoutSession);
      //TODO send receipt to client
    }

    await em.flush();
  },

  registerPayment: async (
    stripePayment: StripePaymentIntent,
    checkoutSession: Stripe.Response<Stripe.Checkout.Session>
  ) => {
    const today = startOfDay(new Date());

    await em.nativeUpdate(
      Membership,
      { dateTo: { $gt: today }, client: stripePayment.client },
      { dateTo: today }
    );

    const membershipAux = {
      debt: 0,
      type: stripePayment.membershipType,
      client: stripePayment.client,
    };
    const membership = em.create(Membership, membershipAux as Membership);

    const paymentAux = {
      paymentMethod: PaymentMethodEnum.STRIPE,
      amount: checkoutSession.amount_total! / 100,
      membership,
      stripePayment,
    };
    em.create(Payment, paymentAux as Payment);
  },
};
