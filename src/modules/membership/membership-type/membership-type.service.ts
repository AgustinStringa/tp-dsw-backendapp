import Stripe from "stripe";
import { environment } from "../../../config/env.config";
import { MembershipType } from "./membership-type.entity";

const stripe = new Stripe(environment.stripe.apiKey as string);

export const membershipTypeService = {
  createStripeProduct: async (
    membType: MembershipType
  ): Promise<MembershipType> => {
    const product = await stripe.products.create({
      name: membType.name,
      description: membType.description,
    });

    membType.stripeId = product.id;
    return membType;
  },

  createStripePrice: async (
    membType: MembershipType
  ): Promise<MembershipType> => {
    const price = await stripe.prices.create({
      unit_amount: membType.price * 100, // en centavos
      currency: "ars",
      product: membType.stripeId,
    });

    membType.stripePriceId = price.id;
    return membType;
  },

  archiveStripePrice: async (membType: MembershipType) => {
    await stripe.prices.update(membType.stripePriceId, {
      active: false,
    });
  },
};
