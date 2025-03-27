import {
  Embeddable,
  Embedded,
  Entity,
  ManyToOne,
  Property,
  Rel,
} from "@mikro-orm/core";
import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Membership } from "../membership/membership.entity.js";
import { PaymentMethodEnum } from "../../../utils/enums/payment-method.enum.js";
import { PaymentStatusEnum } from "../../../utils/enums/payment-status.enum.js";

@Embeddable()
class Stripe {
  @Property()
  checkoutStatus!: string;

  @Property()
  created!: number;

  @Property()
  paymentIntent!: string | undefined;

  @Property()
  sessionId!: string;
}

@Entity()
export class Payment extends BaseEntity {
  @Property()
  dateTime: Date = new Date();

  @IsNotEmpty()
  @Property({ nullable: false })
  paymentMethod!: PaymentMethodEnum;

  @Min(0.01)
  @IsNumber()
  @Property({ nullable: false })
  amount!: number; //en ars, no en centavos

  @ManyToOne(() => Membership)
  membership!: Rel<Membership>;

  @Property({ nullable: false })
  status!: PaymentStatusEnum;

  @Embedded(() => Stripe, { nullable: true })
  stripe?: Stripe | undefined;
}
