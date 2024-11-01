import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Client } from "./Client.entity.js";

@Entity()
export class Attendance extends BaseEntity {
  @Property()
  dateTime?: Date = new Date();

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;
}
