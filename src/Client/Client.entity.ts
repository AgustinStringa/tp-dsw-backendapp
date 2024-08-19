import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import User from "../shared/interfaces/user.interface.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Progress } from "./Progress.entity.js";
import { Goal } from "./Goal.entity.js";
import { CurrentMembership } from "../Membership/CurrentMembership.entity.js";

@Entity()
export class Client extends BaseEntity implements User {
  @Property({ nullable: false })
  username!: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  firstName!: string;

  @Property({ nullable: false })
  lastName!: string;

  @OneToMany({
    entity: () => Progress,
    mappedBy: "client",
    orphanRemoval: true,
  })
  progresses = new Collection<Progress>(this);

  @OneToMany({
    entity: () => Goal,
    mappedBy: "client",
    orphanRemoval: true,
  })
  goals = new Collection<Goal>(this);

  @OneToMany({
    entity: () => CurrentMembership,
    mappedBy: "client",
    orphanRemoval: true,
  })
  memberships = new Collection<CurrentMembership>(this);
}
