import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Client } from "../Client/Client.entity.js";
import { Class } from "./Class.entity.js";

@Entity()
export class Registration extends BaseEntity{
  @Property()
  dateTime: Date = new Date();

  @Property({nullable: true})
  cancelDateTime : Date = new Date(); //no se como ponerlo null

  @ManyToOne(()=> Client, {nullable:false})
  client !: Rel<Client>;

  @ManyToOne(()=> Class, {nullable: false})
  class !: Rel<Class>;
}