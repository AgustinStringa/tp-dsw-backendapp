import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
@Entity()
export class Excercise extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  urlVideo!: string;
}
