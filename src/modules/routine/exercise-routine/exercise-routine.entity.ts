import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Exercise } from "../exercise/exercise.entity.js";
import { Routine } from "../routine/routine.entity.js";

@Entity({ tableName: "exerciseRoutine" })
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
  exercise!: Rel<Exercise>;
}
