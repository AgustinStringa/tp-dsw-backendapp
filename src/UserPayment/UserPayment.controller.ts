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

if (!process.env.STRIPE_API_KEY) {
  throw new Error(
    "The Stripe API key is not defined in the environment variables."
  );
}
const stripe = new Stripe(process.env.STRIPE_API_KEY);

const domain = "https://youtube.com";
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
            created: session.created,
            paymentIntent: undefined,
            sessionId: session.id,
            checkoutStatus: session.status,
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
};

export { controller };
