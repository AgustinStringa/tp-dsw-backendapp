import crypto from "node:crypto";
import IUser from "../IUser.js";

export class Client implements IUser {
  constructor(
    public username: string,
    public password: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public id = crypto.randomUUID()
  ) {}
}
