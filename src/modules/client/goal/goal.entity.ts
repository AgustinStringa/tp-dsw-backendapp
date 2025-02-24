import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Client } from "../client/client.entity.js";

@Entity()
export class Goal extends BaseEntity {
  @Property({ type: Date })
  createdAt? = new Date();

  @IsNumber()
  @Property({ nullable: false })
  fatPercentage!: number;

  @IsNotEmpty()
  @Property({ nullable: false })
  bodyMeasurements!: string;

  @Property({ nullable: false })
  done: boolean = false;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;

  //id is in BaseEntity.
}
