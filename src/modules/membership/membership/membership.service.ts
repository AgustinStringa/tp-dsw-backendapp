import { Client } from "../../client/client/client.entity.js";
import { HttpError } from "../../../utils/errors/http-error.js";
import { Membership } from "./membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";

const em = orm.em;

export const membershipService = {
  checkActiveMembership: async (client: Client) => {
    const membership = await em.findOne(Membership, {
      client: client,
      dateFrom: { $lte: new Date() },
      dateTo: { $gt: new Date() },
    });

    if (!membership)
      throw new HttpError(400, "El cliente no tiene una membresía activa.");
  },
};
