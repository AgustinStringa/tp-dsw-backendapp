import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../config/db/base-entity.entity.js";
import { CheckoutSessionStatusEnum } from "../../utils/enums/checkout-session-status.enum.js";
import { Client } from "../client/client/client.entity.js";
import { MembershipType } from "../membership/membership-type/membership-type.entity.js";
import { Payment } from "../membership/payment/payment.entity.js";
import { PaymentStatusEnum } from "../../utils/enums/payment-status.enum.js";

@Entity()
export class StripePaymentIntent extends BaseEntity {
  @Property()
  sessionId!: string;

  @Property()
  created!: number;

  @Property({ nullable: true })
  paymentIntent!: string | undefined;

  @Property({ nullable: false })
  status!: PaymentStatusEnum;

  @Property()
  checkoutSessionStatus!: CheckoutSessionStatusEnum;

  @ManyToOne(() => MembershipType)
  membershipType!: Rel<MembershipType>;

  @ManyToOne(() => Client)
  client!: Rel<Client>;

  @OneToOne(() => Payment, { nullable: true })
  payment?: Rel<Payment>;
}
