import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
} from "@mikro-orm/mongodb";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import IUser from "../IUser.js";

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

  //id is in BaseEntity. Add MembershipType, etc... Relationships
}
