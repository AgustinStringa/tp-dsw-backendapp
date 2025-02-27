import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { Client } from "../client/client/client.entity.js";
import { Trainer } from "../trainer/trainer/trainer.entity.js";
import { BaseEntity } from "../../config/db/base-entity.entity.js";

@Entity()
export class Message extends BaseEntity {
  @Property({ nullable: false })
  content!: string;

  @ManyToOne(() => Client)
  client!: Client;

  @ManyToOne(() => Trainer)
  trainer!: Trainer;

  @Property({ nullable: false })
  createdAt!: Date;
}
