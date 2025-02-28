import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Class } from "../class/class.entity.js";
import { Client } from "../../client/client/client.entity.js";

@Entity()
export class Registration extends BaseEntity {
  @Property()
  dateTime: Date = new Date();

  @Property({ type: "datetime", nullable: true })
  cancelDateTime: Date | undefined;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;

  @ManyToOne(() => Class, { nullable: false })
  class!: Rel<Class>;
}
