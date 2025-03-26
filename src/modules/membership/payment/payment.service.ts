import { Membership } from "../membership/membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { PaymentStatusEnum } from "../../../utils/enums/payment-status.enum.js";

const em = orm.em;

export const paymentService = {
  updateMembershipDebt: async (membershipId: Membership) => {
    const membership = await em.findOneOrFail(Membership, membershipId, {
      populate: ["payments", "type"],
    });

    const totalPaid = membership.payments.reduce((sum, payment) => {
      return payment.status === PaymentStatusEnum.PAID
        ? sum + payment.amount
        : sum;
    }, 0);

    membership.debt =
      membership.type.price > totalPaid ? membership.type.price - totalPaid : 0;
    await em.flush();
  },
};
