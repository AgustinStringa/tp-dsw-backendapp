import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { ExcerciseDoneFromRoutine } from "../ExcerciseDoneFromRoutine/ExcerciseDoneFromRoutine.js";
@Entity()
export class Excercise extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  @Property({ nullable: false })
  urlVideo!: string;

  @ManyToOne(() => Trainer, { nullable: false })
  trainer!: Rel<Trainer>;

  @OneToMany(() => ExcerciseDoneFromRoutine, (edone) => edone.excercise, {
    cascade: [Cascade.ALL],
  })
  excercisesDone = new Collection<Excercise>(this);
}
