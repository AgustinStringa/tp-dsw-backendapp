import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { MembershipType } from "./MembershipType.entity.js";
import { Client } from "../Client/Client.entity.js";
import { Payment } from "./Payment.entity.js";
import { addMonths, startOfDay } from "date-fns";

@Entity()
export class CurrentMembership extends BaseEntity {
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
