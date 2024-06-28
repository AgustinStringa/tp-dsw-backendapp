import { Excercise } from "../Exercise/Exercise.entity.js";
import { Entity, Property, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class ExcerciseDoneFromRoutine extends BaseEntity {
  @Property({ nullable: false })
  weight!: number;

  @Property({ nullable: false })
  series!: number;

  @Property({ nullable: false })
  repetitions!: number;

  @ManyToOne(() => Excercise, { nullable: false })
  excercise!: Rel<Excercise>;
}
