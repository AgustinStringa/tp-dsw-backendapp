import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { IsNotEmpty } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Class } from "../class/class.entity.js";

@Entity()
export class ClassType extends BaseEntity {
  @IsNotEmpty()
  @Property({ nullable: false })
  name!: string; // pilates, zumba, boxeo, yoga, crossfit...

  @IsNotEmpty()
  @Property({ nullable: false })
  description!: string;

  @OneToMany({
    entity: () => Class,
    mappedBy: "classType",
    orphanRemoval: true,
  })
  classes = new Collection<Class>(this);
}
