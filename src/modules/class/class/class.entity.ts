import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Rel,
} from "@mikro-orm/core";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { ClassType } from "../class-type/class-type.entity.js";
import { Registration } from "../registration/registration.entity.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";

@Entity()
export class Class extends BaseEntity {
  @Max(6)
  @Min(0)
  @IsInt()
  @Property({ nullable: false })
  day!: number;

  @IsNotEmpty()
  @Property({ nullable: false })
  startTime!: string; // HH:MM

  @IsNotEmpty()
  @Property({ nullable: false })
  endTime!: string; // HH:MM

  @Min(1)
  @IsInt()
  @Property({ nullable: false })
  maxCapacity!: number;

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
