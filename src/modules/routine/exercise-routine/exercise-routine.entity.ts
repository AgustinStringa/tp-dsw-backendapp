import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Exercise } from "../exercise/exercise.entity.js";
import { Routine } from "../routine/routine.entity.js";

@Entity({ tableName: "exerciseRoutine" })
export class ExerciseRoutine extends BaseEntity {
  @Min(1)
  @IsInt()
  @Property()
  week!: number;

  @Max(6)
  @Min(0)
  @IsInt()
  @Property()
  day!: number;

  @Min(1)
  @IsInt()
  @Property()
  series!: number;

  @Min(1)
  @IsInt()
  @Property()
  repetitions!: number;

  @Min(0)
  @IsOptional()
  @Property()
  weight?: number | null = null;

  @ManyToOne(() => Routine, { nullable: false })
  routine!: Rel<Routine>;

  @ManyToOne(() => Exercise, { nullable: false })
  exercise!: Rel<Exercise>;
}
