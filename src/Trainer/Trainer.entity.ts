import { Entity, Property, OneToMany, Collection } from "@mikro-orm/core";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Class } from "../Class/Class.entity.js";
import { IUser } from "../shared/interfaces/user.interface.js";

@Entity()
export class Trainer extends BaseEntity implements IUser {
  @IsNotEmpty()
  @Property({ nullable: false })
  lastName!: string;

  @IsNotEmpty()
  @Property({ nullable: false })
  firstName!: string;

  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(8)
  @Property({ nullable: false, unique: true })
  dni!: string;

  @IsNotEmpty()
  @Property({ nullable: false, unique: true })
  email!: string;

  @IsNotEmpty()
  @Property({ nullable: false })
  password!: string;

  @OneToMany({
    entity: () => Class,
    mappedBy: "trainer",
    orphanRemoval: true,
  })
  class = new Collection<Class>(this);
}
