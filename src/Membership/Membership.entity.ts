import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Rel,
} from "@mikro-orm/core";
import { addMonths, startOfDay } from "date-fns";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Client } from "../Client/Client.entity.js";
import { MembershipType } from "./MembershipType.entity.js";
import { Payment } from "./Payment.entity.js";

@Entity()
export class Membership extends BaseEntity {
  @Property()
  dateFrom = startOfDay(new Date());

  @Property()
  dateTo = addMonths(this.dateFrom, 1);

  @Property()
  paid: boolean = false;

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
