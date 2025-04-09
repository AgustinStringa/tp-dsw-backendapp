import { startOfDay, subDays } from "date-fns";
import { Membership } from "../../membership/membership/membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Registration } from "./registration.entity.js";

const em = orm.em.fork();

export const registrationService = {
  deleteRegistrationsWithoutMembership: async () => {
    const limitDate = startOfDay(subDays(new Date(), 5));
    const cancelDateTime = new Date();

    const registrations = await em.find(
      Registration,
      {
        cancelDateTime: null,
      },
      { populate: ["client.memberships"] }
    );

    const registrationsToUpdate = registrations.filter(
      (registration) =>
        !registration.client.memberships
          .getItems()
          .some((membership: Membership) => membership.dateTo > limitDate)
    );

    await em.nativeUpdate(
      Registration,
      { _id: { $in: registrationsToUpdate.map((r) => r._id) } },
      { cancelDateTime }
    );
  },
};
