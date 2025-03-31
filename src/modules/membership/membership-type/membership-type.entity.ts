import { Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { IsNotEmpty } from "class-validator";
import { Membership } from "../membership/membership.entity.js";

@Entity()
export class MembershipType extends BaseEntity {
  @IsNotEmpty()
  @Property({ nullable: false })
  name!: string;

  @IsNotEmpty()
  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  price!: number;

  @Property({ nullable: false })
  stripeId!: string;

  @Property({ nullable: false })
  stripePriceId!: string;

  @OneToMany({
    entity: () => Membership,
    mappedBy: "type",
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);
}
