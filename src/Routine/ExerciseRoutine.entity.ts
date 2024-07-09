import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Routine } from "./Routine.entity.js";
import { Exercise } from "./Exercise.entity.js";
@Entity({ tableName: "dailyRoutine" })
export class ExerciseRoutine extends BaseEntity {
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

  @ManyToOne(() => Exercise, { nullable: false })
  exercise!: Rel<Routine>;
}
