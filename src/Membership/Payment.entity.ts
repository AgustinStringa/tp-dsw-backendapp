import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Membership } from "./Membership.entity.js";

@Entity()
export class Payment extends BaseEntity {
  @Property()
  dateTime: Date = new Date();

  @Property({ nullable: false })
  payMethod!: string;

  @Property({ nullable: true })
  amount!: number;

  @ManyToOne(() => Membership)
  membership!: Rel<Membership>;
}
