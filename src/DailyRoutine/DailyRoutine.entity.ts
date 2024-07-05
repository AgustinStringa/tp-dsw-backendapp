import { Entity, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { MonthlyRoutine } from "../MonthlyRoutine/MonthlyRoutine.entity.js";

@Entity({ tableName: "dailyRoutines" })
export class DailyRoutine extends BaseEntity {
  @Property()
  day!: Date;

  @ManyToOne(() => MonthlyRoutine, { nullable: false })
  monthlyRoutine!: Rel<MonthlyRoutine>;
}
