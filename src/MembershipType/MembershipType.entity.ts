import { ObjectId } from "mongodb";
import crypto from "node:crypto";

export class MembershipType {
  constructor(
    public name: string,
    public description: string, // gym, pileta, clases
    public price: number,
    public id = crypto.randomUUID(),
    public _id?: ObjectId
  ) {}
}
