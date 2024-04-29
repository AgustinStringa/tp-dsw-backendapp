import { DailyRutine } from "../DailyRutines/DailyRutine.entity.js";
export class MonthlyRutine {
  constructor(
    public days: DailyRutine[],
    public month: number,
    public year: number
  ) {}
}
