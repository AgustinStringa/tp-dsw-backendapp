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
  payMethod!: string;

  @IsNumber()
  @Property({ nullable: false })
  amount!: number;

  @ManyToOne(() => Membership)
  membership!: Rel<Membership>;
}
