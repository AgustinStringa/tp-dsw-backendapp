import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Client } from "./Client.entity.js";

@Entity()
export class Progress extends BaseEntity {
  @Property({ nullable: false })
  date!: Date;

  @Property({ nullable: false })
  weight!: number;

  @Property({ nullable: false })
  fatPercentage!: number;

  @Property({ nullable: false })
  bodyMeasurements!: string;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;

  //id is in BaseEntity.
}
