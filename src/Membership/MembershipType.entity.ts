import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Membership } from "./Membership.entity.js";

@Entity()
export class MembershipType extends BaseEntity {
  @IsNotEmpty()
  @Property({ nullable: false })
  name!: string;

  @IsNotEmpty()
  @Property({ nullable: false })
  description!: string;

  @IsNumber()
  @Property({ nullable: false })
  price!: number;

  @Property({ nullable: true })
  stripePriceId?: string;

  @OneToMany({
    entity: () => Membership,
    mappedBy: "type",
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);
}
