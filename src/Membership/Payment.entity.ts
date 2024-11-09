import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Membership } from "./Membership.entity.js";

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

  @Property({ nullable: true })
  stripe:
    | undefined
    | {
        created: number;
        paymentIntent: string | undefined;
        sessionId: string;
        checkoutStatus: string | null;
      };
}
