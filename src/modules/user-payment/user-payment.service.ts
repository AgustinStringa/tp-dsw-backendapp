import { format, startOfDay } from "date-fns";
import { CheckoutSessionStatusEnum } from "../../utils/enums/checkout-session-status.enum.js";
import { Client } from "../client/client/client.entity.js";
import { environment } from "../../config/env.config.js";
import { HttpError } from "../../utils/errors/http-error.js";
import { Membership } from "../membership/membership/membership.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Payment } from "../membership/payment/payment.entity.js";
import { PaymentMethodEnum } from "../../utils/enums/payment-method.enum.js";
import { PaymentStatusEnum } from "../../utils/enums/payment-status.enum.js";
import { sendEmail } from "../../utils/notifications/notifications.js";
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
      const newMembership = await userPaymentService.registerPayment(
        stripePayment,
        checkoutSession
      );
      sendReceiptByEmail(newMembership);
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
    return membership;
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

async function sendReceiptByEmail(membership: Membership) {
  await em.populate(membership, ["client", "type", "payments"]);

  sendEmail(
    "Recibo de Pago - Gimnasio Iron Haven",
    `
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="color: #28a745;">¡Gracias por tu pago, ${
          membership.client.firstName
        }!</h2>

        <p>Te confirmamos que hemos recibido tu pago correspondiente a la membresía <strong>${
          membership.type.name
        }</strong>.</p>

        <p><strong>Detalles del pago:</strong></p>
        <ul style="padding-left: 20px;">
          <li><strong>Cliente:</strong> ${membership.client.firstName} ${
      membership.client.lastName
    }</li>
          <li><strong>Membresía:</strong> ${membership.type.name}</li>
          <li><strong>Monto:</strong> $${membership.payments[0].amount.toLocaleString(
            "es-AR"
          )}</li>
          <li><strong>Fecha y hora:</strong> ${format(
            new Date(),
            "dd/MM/yyyy HH:mm"
          )} hs</li>
        </ul>

        <p>Gracias por seguir confiando en nosotros. Si tenés alguna duda sobre tu pago o membresía, no dudes en contactarnos.</p>

        <p>Saludos cordiales,</p>

        <div style="color: #FF5733; font-size: 16px; font-weight: bold;">
          Gimnasio Iron Haven
        </div>

        <p><a href="${
          environment.systemUrls.frontendUrl
        }" style="color: #007bff;">Ir al sitio web</a></p>
      </div>
    </body>
  `,
    [membership.client.email]
  ).catch(() => {});
}
