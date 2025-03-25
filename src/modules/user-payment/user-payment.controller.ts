import Stripe from "stripe";
import { NextFunction, Request, Response } from "express";
import { startOfDay } from "date-fns";
import { authService } from "../auth/auth/auth.service.js";
import { environment } from "../../config/env.config.js";
import { handleError } from "../../utils/errors/error-handler.js";
import { Membership } from "../membership/membership/membership.entity.js";
import { MembershipCreatedByEnum } from "../../utils/enums/membership-created-by.enum.js";
import { MembershipType } from "../membership/membership-type/membership-type.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Payment } from "../membership/payment/payment.entity.js";
import { PaymentMethodEnum } from "../../utils/enums/payment-method.enum.js";
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
      const client = (await authService.getUser(req)).user;
      if (client.id !== req.body.sanitizedInput.client) {
        res.status(401).json({ message: "Cliente no autorizado." });
        return;
      }

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
      membership.createdBy = MembershipCreatedByEnum.STRIPE;
      membership.debt = membType.price;
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
          success_url: `${frontendUrl}/home?stripe_id={CHECKOUT_SESSION_ID}`,
          //TODO call a fullfill desde el front
          cancel_url: `${frontendUrl}/home`,
        });

      const payment: any = {
        paymentMethod: PaymentMethodEnum.STRIPE,
        amount: membType.price,
        membership: membership,
        status: session.payment_status,
        stripe: {
          checkoutStatus: session.status,
          created: session.created,
          paymentIntent: undefined,
          sessionId: session.id,
        },
      };

      em.create(Payment, payment);
      await em.flush();

      res.status(200).json(session.url);
    } catch (error: any) {
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
    } catch (error: any) {
      handleError(error, res);
    }
  },
};
