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
import { Excercise } from "../Exercise/Exercise.entity.js";

@Entity()
export class Trainer extends BaseEntity implements IUser {
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
    entity: () => Excercise,
    mappedBy: "trainer",
    orphanRemoval: true,
  })
  excercises = new Collection<Excercise>(this);
}
