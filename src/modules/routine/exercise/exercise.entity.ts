import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { IsNotEmpty } from "class-validator";

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
