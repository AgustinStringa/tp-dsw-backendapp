import { CheckoutSessionStatusEnum } from "../../utils/enums/checkout-session-status.enum.js";
import { Client } from "../client/client/client.entity.js";
import { environment } from "../../config/env.config.js";
import { HttpError } from "../../utils/errors/http-error.js";
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
      checkoutSessionStatus:
        checkoutSession.status as CheckoutSessionStatusEnum,
    });

    if (checkoutSession.payment_status === "paid") {
      await userPaymentService.registerPayment(stripePayment, checkoutSession);
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

  closeOpenSession: async (client: Client): Promise<void> => {
    const stripePaymentIntent = await em.findOne(StripePaymentIntent, {
      client,
      checkoutSessionStatus: CheckoutSessionStatusEnum.OPEN,
    });

    if (stripePaymentIntent === null) return;

    const session = await stripe.checkout.sessions.retrieve(
      stripePaymentIntent.sessionId
    );

    if (session.status === "open") {
      await stripe.checkout.sessions.expire(stripePaymentIntent.sessionId);
      return;
    }

    if (session.status === "expired") {
      stripePaymentIntent.checkoutSessionStatus =
        CheckoutSessionStatusEnum.EXPIRED;
      await em.flush();
      return;
    }

    //"complete"
    throw new HttpError(
      500,
      "Disculpe. Hubo un problema con uno de sus pagos. Comuníquese con uno de nuestros entrenadores."
    );
  },

  expireSession: async (sessionId: string) => {
    const stripePayment = await em.findOne(StripePaymentIntent, {
      sessionId: sessionId,
      checkoutSessionStatus: CheckoutSessionStatusEnum.OPEN,
    });

    if (stripePayment === null) return;

    em.assign(stripePayment, {
      checkoutSessionStatus: CheckoutSessionStatusEnum.EXPIRED,
    });

    await em.flush();
  },
};
