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
import { ClassList } from "./ClassList.entity.js";


@Entity()
export class ClassType extends BaseEntity {
  @Property({ nullable: false })
  name!: string;  // pílates, zumba, pileta (si es que lo manejamos por turnos)

  @Property({ nullable: false })
  description!: string;

  @OneToMany({
    entity: () => ClassList,
    mappedBy: "classType",
    orphanRemoval: true,
  })
  classLists = new Collection<ClassList>(this);

}


