import { DailyRoutine } from "../DailyRoutine/DailyRoutine.entity";

export class MonthlyRoutine {
  constructor(
    public days: DailyRoutine[],
    public month: number,
    public year: number
  ) {}
}
