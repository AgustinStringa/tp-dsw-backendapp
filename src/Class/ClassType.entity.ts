import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Class } from "./Class.entity.js";

@Entity()
export class ClassType extends BaseEntity {
  @Property({ nullable: false })
  name!: string; // pílates, zumba, pileta (si es que lo manejamos por turnos)

  @Property({ nullable: false })
  description!: string;

  @OneToMany({
    entity: () => Class,
    mappedBy: "classType",
    orphanRemoval: true,
  })
  classes = new Collection<Class>(this);
}
