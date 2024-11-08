import dotenv from "dotenv";
import Stripe from "stripe";
import { Request, Response } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { MembershipType } from "../Membership/MembershipType.entity.js";
import { getUser } from "../Auth/Auth.controller.js";

dotenv.config(); //TODO ver si es necesario

if (!process.env.STRIPE_API_KEY) {
  throw new Error(
    "The Stripe API key is not defined in the environment variables."
  );
}
const stripe = new Stripe(process.env.STRIPE_API_KEY);

const domain = "https://youtube.com";
const em = orm.em;

const controller = {
  add: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const membType = await em.findOneOrFail(MembershipType, id);
      console.log(membType.stripePriceId);
      
      const client = await getUser(req);
      if (client) {
        //TODO validar que el cliente tenga una membresía activa de ese tipo
        //permitir pagar un monto distinto?

        const session = await stripe.checkout.sessions.create({
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
          metadata: { client_id: client.id },
        });

        if (session.url) {
          res.redirect(303, session.url);
          res.status(200);
        } else res.status(500).send("Failed to create Stripe checkout session");
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { controller };
