import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Client } from "../client/client.entity.js";

@Entity()
export class Progress extends BaseEntity {
  @Property({ nullable: false })
  date!: Date;

  @IsNumber()
  @Property({ nullable: false })
  weight!: number;

  @IsNumber()
  @Property({ nullable: false })
  fatPercentage!: number;

  @IsNotEmpty()
  @Property({ nullable: false })
  bodyMeasurements!: string;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;
}
