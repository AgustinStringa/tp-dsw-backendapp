import crypto from "node:crypto";

export class MembershipType {
  constructor(
    public username: string,
    public description: string, // gym, pileta, clases
    public id = crypto.randomUUID()
  ) {}
}
