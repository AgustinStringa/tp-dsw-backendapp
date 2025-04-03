export class TrainerHomeDTO {
  incomeLast30Days: number;
  stripeIncomeLast30Days: number;
  activeClassesCount: number;
  activeMembershipsCount: number;
  clientClassRegistrationsCount: number;

  constructor(
    incomeLast30Days: number,
    stripeIncomeLast30Days: number,
    activeClassesCount: number,
    activeMembershipsCount: number,
    clientClassRegistrationsCount: number
  ) {
    this.incomeLast30Days = incomeLast30Days;
    this.stripeIncomeLast30Days = stripeIncomeLast30Days;
    this.activeClassesCount = activeClassesCount;
    this.activeMembershipsCount = activeMembershipsCount;
    this.clientClassRegistrationsCount = clientClassRegistrationsCount;
  }
}
