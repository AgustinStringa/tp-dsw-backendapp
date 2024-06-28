import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { CurrentMembership } from "./CurrentMembership.entity.js";

@Entity()
export class MembershipType extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string; //gym, pileta, gym + pileta...

  @Property({ nullable: false })
  price!: number;

  @OneToMany({
    entity: () => CurrentMembership,
    mappedBy: "type",
    orphanRemoval: true,
  })
  memberships = new Collection<CurrentMembership>(this);
}
