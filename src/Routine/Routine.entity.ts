import {
  Cascade,
  OneToMany,
  Collection,
  Entity,
  Property,
  ManyToOne,
  Rel,
} from "@mikro-orm/core";
import { ExcerciseRoutine } from "./ExcerciseRoutine.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { Client } from "../Client/Client.entity.js";
@Entity({ tableName: "routine" })
export class Routine extends BaseEntity {
  @Property()
  month!: number;

  @Property()
  year!: number;

  @ManyToOne(() => Trainer, { nullable: false })
  trainer!: Rel<Trainer>;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Trainer>;

  @OneToMany(() => ExcerciseRoutine, (eRoutine) => eRoutine.routine, {
    cascade: [Cascade.ALL],
  })
  excercisesRoutine = new Collection<ExcerciseRoutine>(this);
}
