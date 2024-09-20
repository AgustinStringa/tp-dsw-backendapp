import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Class } from "../Class/Class.entity.js";
import { IUser } from "../shared/interfaces/user.interface.js";

@Entity()
export class Trainer extends BaseEntity implements IUser {
  @Property({ nullable: false })
  lastName!: string;

  @Property({ nullable: false })
  firstName!: string;

  @Property({ nullable: false, unique: true })
  dni!: string;

  @Property({ nullable: false, unique: true })
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
