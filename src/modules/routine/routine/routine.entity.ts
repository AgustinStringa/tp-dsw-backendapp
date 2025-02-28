import {
  Cascade,
  OneToMany,
  Collection,
  Entity,
  Property,
  ManyToOne,
  Rel,
} from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { Client } from "../../client/client/client.entity.js";
import { ExerciseRoutine } from "../exercise-routine/exercise-routine.entity.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";

@Entity({ tableName: "routine" })
export class Routine extends BaseEntity {
  @Property()
  start!: Date;

  @Property()
  end!: Date;

  @ManyToOne(() => Trainer, { nullable: false })
  trainer!: Rel<Trainer>;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Client>;

  @OneToMany(() => ExerciseRoutine, (eRoutine) => eRoutine.routine, {
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  exercisesRoutine = new Collection<ExerciseRoutine>(this);
}
