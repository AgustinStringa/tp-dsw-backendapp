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
import IUser from "../IUser.js";
import { Progress } from "./Progress.entity.js";
import { Goal } from "./Goal.entity.js";

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

  //id is in BaseEntity. Add more relationships
}
