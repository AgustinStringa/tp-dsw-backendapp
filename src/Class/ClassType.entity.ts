import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Class } from "./Class.entity.js";
import { IsNotEmpty } from "class-validator";

@Entity()
export class ClassType extends BaseEntity {
  @IsNotEmpty()
  @Property({ nullable: false })
  name!: string; // pilates, zumba, boxeo, yoga, crossfit...

  @Property({ nullable: false })
  description!: string;

  @OneToMany({
    entity: () => Class,
    mappedBy: "classType",
    orphanRemoval: true,
  })
  classes = new Collection<Class>(this);
}
