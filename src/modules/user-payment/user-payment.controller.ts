import dotenv from "dotenv";
import Stripe from "stripe";
import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { MembershipType } from "../Membership/MembershipType.entity.js";
import { getUser } from "../Auth/Auth.controller.js";
import { Payment } from "../Membership/Payment.entity.js";
import { Membership } from "../Membership/Membership.entity.js";
import { startOfDay } from "date-fns";

dotenv.config(); //TODO ver si es necesario

if (!process.env.STRIPE_API_KEY || !process.env.STRIPE_WEBHOOK) {
  throw new Error("Problem with the environment variables.");
}
const stripe = new Stripe(process.env.STRIPE_API_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK;

const domain = "http://localhost:4200";
const em = orm.em;

export const controller = {
  initiatePayment: async function (req: Request, res: Response) {
    //Los pagos son al momento de contratar una nueva membresía. Si el cliente cuenta con una activa, se modifica la fecha de vencimiento.

    try {
      const client = await getUser(req);
      if (client && client.id === req.body.sanitizedInput.client) {
        const membType = await em.findOneOrFail(
          MembershipType,
          req.body.sanitizedInput.type
        );

        const today = startOfDay(new Date());

        await em.nativeUpdate(
          Membership,
          { dateTo: { $gt: today }, client: req.body.sanitizedInput.client },
          { dateTo: today }
        );

        const membership = em.create(Membership, req.body.sanitizedInput);
        await em.flush();

        const session: Stripe.Checkout.Session =
          await stripe.checkout.sessions.create({
            line_items: [
              {
                price: membType.stripePriceId,
                quantity: 1,
              },
            ],
            mode: "payment", //subscription es para pagos recurrentes
            success_url: `${domain}/success.html`,
            cancel_url: `${domain}/cancel.html`,
            //customer_email
          });

        const payment: any = {
          paymentMethod: "stripe",
          amount: membType.price,
          membership: membership,
          status: session.payment_status,
          stripe: {
            checkoutStatus: session.status,
            created: session.created,
            fulfilled: false,
            paymentIntent: undefined,
            sessionId: session.id,
          },
        };

        em.create(Payment, payment);
        await em.flush();

        res.status(200).json(session.url); //TODO realizar redirect (problema con CORS) res.redirect(302, session.url);
      } else {
        res.status(401).json({ message: "client unauthorized" });
      }
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  handleWebhook: async function (req: Request, res: Response) {
    try {
      const payload = req.body;
      const signature = req.headers["stripe-signature"] as string;

      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );

      if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
      ) {
        fulfillCheckout(event.data.object.id);
      }

      res.status(200).end();
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError)
        return res.status(400).send(`Webhook Error: ${err.message}`);
      else return res.status(500).send("Unexpected error occurred");
    }
  },

  sanitizeRequest: async function (
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      client: req.body.client,
      type: req.body.type,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });

    next();
  },
};

async function fulfillCheckout(sessionId: any) {
  try {
    const payment = await em.findOne(Payment, {
      stripe: { sessionId: sessionId, fulfilled: false },
    }); //TODO bloquear registro

    if (payment === null) return;

    em.assign(payment, { stripe: { fulfilled: true } });
    em.flush();

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    }); //En el negocio, las compras son para una sola membresía

    //ver caso de no_payment_required
    if (checkoutSession.payment_status === "paid") {
      em.assign(payment, {
        status: "paid",
        stripe: {
          checkoutStatus: checkoutSession.status,
          paymentIntent: checkoutSession.payment_intent as string,
        },
      });
      em.flush();
    }
  } catch (error: any) {
    throw error;
  }
}
