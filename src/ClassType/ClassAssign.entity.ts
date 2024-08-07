import { 
  Collection, 
  Entity, 
  ManyToMany, 
  ManyToOne, 
  Property, 
  Rel 
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Client } from "../Client/Client.entity.js";
import { ClassList } from "./ClassList.entity.js";

@Entity()
export class ClassAssign extends BaseEntity{
  @Property({nullable: false})
  dateAssigned!: Date;

  @ManyToOne(() => ClassList)
  classList!: Rel<ClassList>

  @ManyToMany({
    entity: () => Client, 
    mappedBy: "classAssigns"
  }) //,owner=true este o el otro
  clients= new Collection<Client>(this);
}