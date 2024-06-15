import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Client } from "./Client.entity.js";

@Entity()
export class Goal extends BaseEntity {
  @Property({ type: Date })
  createdAt? = new Date();

  @Property({ nullable: false })
  fatPercentage!: number;

  @Property({ nullable: false })
  bodyMeasurements!: string;

  @Property({ nullable: true })
  done: boolean = false;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;

  //id is in BaseEntity.
}
