import { Membership } from "../membership/membership/membership.entity";

export class ClientHomeDTO {
  goalsCount: number;
  progressesCount: number;
  registrationsCount: number;
  currentMembership: Membership | null;

  constructor(
    goalsCount: number,
    progressesCount: number,
    registrationsCount: number,
    currentMembership: Membership | null
  ) {
    this.goalsCount = goalsCount;
    this.progressesCount = progressesCount;
    this.registrationsCount = registrationsCount;
    this.currentMembership = currentMembership;
  }
}
