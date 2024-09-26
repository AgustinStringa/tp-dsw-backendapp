import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  OneToMany,
  Collection,
} from "@mikro-orm/core";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ClassType } from "./ClassType.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { Registration } from "./Registration.entity.js";

@Entity()
export class Class extends BaseEntity {
  @IsNumber()
  @Property({ nullable: false })
  day!: number;

  @IsNotEmpty()
  @Property({ nullable: false })
  startTime!: string; // 8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00

  @IsNotEmpty()
  @Property({ nullable: false })
  endTime!: string; // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

  @IsNumber()
  @Property({ nullable: false })
  maxCapacity!: number; // 10, 15, 20, 25, 30, 35, 40, 45, 50 people

  @IsNotEmpty()
  @Property({ nullable: false })
  location!: string; // gym, sum, park, beach, online

  @Property({ nullable: false })
  active!: boolean;

  @ManyToOne(() => ClassType, { nullable: false })
  classType!: Rel<ClassType>;

  @ManyToOne(() => Trainer, { nullable: false })
  trainer!: Rel<Trainer>;

  @OneToMany({
    entity: () => Registration,
    mappedBy: "class",
    orphanRemoval: true,
  })
  registrations = new Collection<Registration>(this);
}
