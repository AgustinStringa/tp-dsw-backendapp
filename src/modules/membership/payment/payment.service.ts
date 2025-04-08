import { Membership } from "../membership/membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";

const em = orm.em;

export const paymentService = {
  updateMembershipDebt: async (membershipId: Membership) => {
    const membership = await em.findOneOrFail(Membership, membershipId, {
      populate: ["payments", "type"],
    });

    const totalPaid = membership.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    membership.debt =
      membership.type.price > totalPaid
        ? parseFloat((membership.type.price - totalPaid).toFixed(2))
        : 0;
    await em.flush();
  },
};
