import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Client } from "../Client/Client.entity.js";
import { Class } from "./Class.entity.js";

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

  constructor(client: Rel<Client>, class_a: Rel<Class>, cancelDateTime?: Date) {
    super();
    this.client = client;
    this.class = class_a;
    this.cancelDateTime = undefined;
  }

  checkCancelDateTime() {
    if (
      this.cancelDateTime === undefined ||
      this.cancelDateTime <= this.dateTime
    )
      this.cancelDateTime = undefined;
  }
}
