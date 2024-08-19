import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import User from "../shared/interfaces/user.interface.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ClassList } from "../ClassType/ClassList.entity.js";

@Entity()
export class Trainer extends BaseEntity implements User {
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
    entity: () => ClassList,
    mappedBy: "trainer",
    orphanRemoval: true,
  })
  classlist = new Collection<ClassList>(this);
}
