import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { IsNotEmpty } from "class-validator";
import { Membership } from "../membership/membership.entity.js";
import { PaymentMethodEnum } from "../../../utils/enums/payment-method.enum.js";
import { StripePaymentIntent } from "../../user-payment/stripe-payment-intent.entity.js";

@Entity()
export class Payment extends BaseEntity {
  @Property()
  dateTime: Date = new Date();

  @IsNotEmpty()
  @Property({ nullable: false })
  paymentMethod!: PaymentMethodEnum;

  @Property({ nullable: false })
  amount!: number; //en ars, no en centavos

  @ManyToOne(() => Membership)
  membership!: Rel<Membership>;

  @OneToOne(() => StripePaymentIntent, { nullable: true })
  stripePayment?: Rel<StripePaymentIntent>;
}
