import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  Embeddable,
  Embedded,
} from "@mikro-orm/core";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Membership } from "./Membership.entity.js";

@Embeddable()
class Stripe {
  @Property()
  checkoutStatus!: string;

  @Property()
  created!: number;

  @Property()
  fulfilled!: boolean;

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
  paymentMethod!: string;

  @IsNumber()
  @Property({ nullable: false })
  amount!: number; //en ars, no en centavos

  @ManyToOne(() => Membership)
  membership!: Rel<Membership>;

  @Property({ nullable: false })
  status!: string;

  @Embedded(() => Stripe, { nullable: true })
  stripe?: Stripe | undefined;
}
