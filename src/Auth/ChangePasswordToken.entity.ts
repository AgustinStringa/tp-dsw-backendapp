import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { IsAlphanumeric, IsBoolean, IsDate, IsNumber } from "class-validator";
import { Client } from "../Client/Client.entity.js";

@Entity()
export class ChangePasswordToken extends BaseEntity {
  @ManyToOne(() => Client, { nullable: false })
  user!: Rel<Client>;

  @Property()
  @IsDate()
  createdAt: Date = new Date();

  @Property()
  @IsAlphanumeric()
  rawToken!: string;

  @Property()
  @IsDate()
  expiresAt!: Date;

  @Property()
  @IsBoolean()
  used: boolean = false;
}
