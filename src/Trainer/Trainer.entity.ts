import User from "../shared/interfaces/user.interface.js";
import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Class } from "../Class/Class.entity.js";

@Entity()
export class Trainer extends BaseEntity implements User {
  @Property({ nullable: false })
  lastName!: string;

  @Property({ nullable: false })
  firstName!: string;

  @Property({ nullable: false })
  dni!: string;

  @Property({ nullable: false })
  email!: string;

  @Property({ nullable: false })
  password!: string;

  @OneToMany({
    entity: () => Class,
    mappedBy: "trainer",
    orphanRemoval: true,
  })
  class = new Collection<Class>(this);
}
