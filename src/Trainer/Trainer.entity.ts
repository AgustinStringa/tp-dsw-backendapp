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
import { ClassList } from "../ClassType/ClassList.entity.js";


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
    entity: () => ClassList,
    mappedBy: "trainer",
    orphanRemoval: true,
  })
  classlist = new Collection<ClassList>(this);
}
