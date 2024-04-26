import crypto from "node:crypto";

export class MembershipType {
  constructor(
    public username: string,
    public description: string,
    public id = crypto.randomUUID()
  ) {}
}
