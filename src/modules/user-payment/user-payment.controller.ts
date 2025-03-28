import { NextFunction, Request, Response } from "express";
import { authService } from "../auth/auth/auth.service.js";
import { CheckoutSessionStatusEnum } from "../../utils/enums/checkout-session-status.enum.js";
import { Client } from "../client/client/client.entity.js";
import { environment } from "../../config/env.config.js";
import { handleError } from "../../utils/errors/error-handler.js";
import { membershipService } from "../membership/membership/membership.service.js";
import { MembershipType } from "../membership/membership-type/membership-type.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { PaymentStatusEnum } from "../../utils/enums/payment-status.enum.js";
import Stripe from "stripe";
import { StripePaymentIntent } from "./stripe-payment-intent.entity.js";
import { userPaymentService } from "./user-payment.service.js";
import { validateObjectId } from "../../utils/validators/data-type.validators.js";

const em = orm.em;
const stripe = new Stripe(environment.stripe.apiKey as string);
const endpointSecret = environment.stripe.webhook as string;
const frontendUrl = environment.systemUrls.frontendUrl;

export const controller = {
  initiatePayment: async function (req: Request, res: Response) {
    // Los pagos son al momento de contratar una nueva membresía.
    // Si el cliente cuenta con una membresía activa, la misma se da de baja modificando su fecha de vencimiento.

    try {
      const client = (await authService.getUser(req)).user as Client;
      if (client.id !== req.body.sanitizedInput.client) {
        res.status(401).json({ message: "Cliente no autorizado." });
        return;
      }

      const openSession = await userPaymentService.findOpenSession(client);
      if (openSession !== null) {
        res.status(303).json(openSession.url);
        return;
      }

      const debt = await membershipService.calcleClientDebt(client);
      if (debt) {
        res.status(403).json({
          message:
            "No puede comprar una membresía. Usted posee una deuda de $" + debt,
        });
        return;
      }

      const membType = await em.findOneOrFail(
        MembershipType,
        req.body.sanitizedInput.type
      );

      const session: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create({
          line_items: [
            {
              price: membType.stripePriceId,
              quantity: 1,
            },
          ],
          mode: "payment", //subscription es para pagos recurrentes
          success_url: `${frontendUrl}/home?stripe_id={CHECKOUT_SESSION_ID}`,
          //TODO call a fullfill desde el front
          cancel_url: `${frontendUrl}/home`,
        });

      const stripePaymentIntent = {
        sessionId: session.id,
        created: session.created,
        paymentIntent: undefined,
        status: session.payment_status as PaymentStatusEnum,
        checkoutSessionStatus: session.status as CheckoutSessionStatusEnum,
        membershipType: membType,
        client: client,
      };

      em.create(StripePaymentIntent, stripePaymentIntent);
      await em.flush();

      res.status(200).json(session.url);
    } catch (error: unknown) {
      handleError(error, res);
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
        await userPaymentService.fulfillCheckout(event.data.object.id);
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
    res: Response,
    next: NextFunction
  ) {
    try {
      req.body.sanitizedInput = {
        client: validateObjectId(req.body.clientId, "clientId"),
        type: validateObjectId(req.body.membershipTypeId, "membershipTypeId"),
      };

      next();
    } catch (error: unknown) {
      handleError(error, res);
    }
  },
};
