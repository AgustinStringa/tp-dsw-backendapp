import { Entity, Property } from "@mikro-orm/core";
import { IsNotEmpty } from "class-validator";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class Exercise extends BaseEntity {
  @IsNotEmpty()
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  urlVideo!: string;
}
