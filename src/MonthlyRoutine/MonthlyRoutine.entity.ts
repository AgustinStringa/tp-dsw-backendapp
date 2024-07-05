import {
  Cascade,
  OneToMany,
  Collection,
  Entity,
  Property,
  ManyToOne,
  Rel,
} from "@mikro-orm/core";
import { DailyRoutine } from "../DailyRoutine/DailyRoutine.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { Client } from "../Client/Client.entity.js";
@Entity({ tableName: "monthlyRoutines" })
export class MonthlyRoutine extends BaseEntity {
  @Property()
  month!: number;

  @Property()
  year!: number;

  @ManyToOne(() => Trainer, { nullable: false })
  trainer!: Rel<Trainer>;

  @ManyToOne(() => Client, { nullable: false })
  client!: Rel<Trainer>;

  @OneToMany(() => DailyRoutine, (dRoutine) => dRoutine.monthlyRoutine, {
    cascade: [Cascade.ALL],
  })
  days = new Collection<DailyRoutine>(this);
}
