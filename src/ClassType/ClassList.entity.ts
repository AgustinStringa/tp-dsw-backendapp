import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ClassType } from "./ClassType.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";

@Entity()
export class ClassList extends BaseEntity {
  @Property({ nullable: false })
  classHour!: string; // 8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00, 20:00, 21:00

  @Property({ nullable: false })
  classDay!: string; // Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

  @Property({ nullable: false })
  state!: string; // active, disable, suspended

  @Property({ nullable: false })
  classDuration!: number; // 30min, 45min, 60min, 90min, 120min

  @Property({ nullable: false })
  maxCapacity!: number; // 10, 15, 20, 25, 30, 35, 40, 45, 50 people

  @Property({ nullable: false })
  place!: string; // gym, sum, park, beach, online

  @ManyToOne(() => ClassType, { nullable: false })
  classType!: Rel<ClassType>;

  @ManyToOne(() => Trainer, { nullable: false })
  trainer!: Rel<Trainer>;
}
