import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Membership } from "./Membership.entity.js";

@Entity()
export class MembershipType extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string; //gym, pileta, gym + pileta...

  @Property({ nullable: false })
  price!: number;

  @OneToMany({
    entity: () => Membership,
    mappedBy: "type",
    orphanRemoval: true,
  })
  memberships = new Collection<Membership>(this);
}
