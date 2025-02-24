import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Rel,
} from "@mikro-orm/core";
import { addMonths, startOfDay } from "date-fns";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Client } from "../../client/client/client.entity.js";
import { MembershipType } from "../membership-type/membership-type.entity.js";
import { Payment } from "../payment/payment.entity.js";

@Entity()
export class Membership extends BaseEntity {
  @Property()
  dateFrom = startOfDay(new Date());

  @Property()
  dateTo = addMonths(this.dateFrom, 1);

  @ManyToOne(() => MembershipType)
  type!: Rel<MembershipType>;

  @ManyToOne(() => Client)
  client!: Rel<Client>;

  @OneToMany({
    entity: () => Payment,
    mappedBy: "membership",
    orphanRemoval: true,
  })
  payments = new Collection<Payment>(this);
}
