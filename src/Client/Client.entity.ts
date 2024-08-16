import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import IUser from "../shared/IUser.js";
import { Progress } from "./Progress.entity.js";
import { Goal } from "./Goal.entity.js";
import { CurrentMembership } from "../Membership/CurrentMembership.entity.js";
import { Routine } from "../Routine/Routine.entity.js";

@Entity()
export class Client extends BaseEntity implements IUser {
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
  @OneToMany({
    entity: () => Routine,
    mappedBy: "client",
    orphanRemoval: true,
  })
  routines = new Collection<Routine>(this);
}
