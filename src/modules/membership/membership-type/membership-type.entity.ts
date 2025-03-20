import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { IsNotEmpty, IsNumber, Min } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Membership } from "../membership/membership.entity.js";

@Entity()
export class MembershipType extends BaseEntity {
  @IsNotEmpty()
  @Property({ nullable: false })
  name!: string;

  @IsNotEmpty()
  @Property({ nullable: false })
  description!: string;

  @Min(0)
  @IsNumber()
  @Property({ nullable: false })
  price!: number;

  @OneToMany({
    entity: () => Membership,
    mappedBy: "type",
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);
}
