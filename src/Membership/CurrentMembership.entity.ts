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

@Entity()
export class CurrentMembership extends BaseEntity {
  @Property({ type: Date })
  dateFrom? = new Date();

  @Property({ nullable: true })
  dateTo: Date | null = null;

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
