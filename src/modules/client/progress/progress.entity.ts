import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Client } from "../client/client.entity.js";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Progress extends BaseEntity {
  @Property({ nullable: false })
  date!: Date;

  @Property({ nullable: false })
  weight!: number;

  @Property({ nullable: false })
  fatPercentage!: number;

  @IsNotEmpty()
  @Property({ nullable: false })
  bodyMeasurements!: string;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;
}
