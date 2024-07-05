import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Routine } from "../Routine/Routine.entity.js";
import { Excercise } from "./Exercise.entity.js";
@Entity({ tableName: "dailyRoutine" })
export class ExcerciseRoutine extends BaseEntity {
  @Property()
  week!: number;

  @Property()
  day!: number;

  @Property()
  series?: number | null = null;

  @Property()
  repetitions?: number | null = null;

  @Property()
  weight?: number | null = null;

  @ManyToOne(() => Routine, { nullable: false })
  routine!: Rel<Routine>;

  @ManyToOne(() => Excercise, { nullable: false })
  excercise!: Rel<Routine>;
}
