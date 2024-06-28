import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { CurrentMembership } from "./CurrentMembership.entity.js";

@Entity()
export class Payment extends BaseEntity {
  @Property()
  dateTime: Date = new Date();

  @Property({ nullable: false })
  payMethod!: string;

  @Property({ nullable: true })
  amount!: number;

  @ManyToOne(() => CurrentMembership)
  membership!: Rel<CurrentMembership>;
}
