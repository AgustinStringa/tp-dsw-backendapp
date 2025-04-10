import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../config/db/base-entity.entity.js";
import { IsNotEmpty } from "class-validator";

@Entity()
export class News extends BaseEntity {
  @Property()
  dateTime: Date = new Date();

  @Property({ nullable: false })
  expirationDateTime?: Date;

  @IsNotEmpty()
  @Property({ nullable: false })
  title!: string;

  @IsNotEmpty()
  @Property({ nullable: false })
  body!: string;

  constructor(title: string, body: string, expirationDateTime?: Date) {
    super();
    this.title = title!;
    this.body = body!;
    this.expirationDateTime = expirationDateTime;
    this.checkExpirationDate();
  }

  checkExpirationDate() {
    if (
      this.expirationDateTime === undefined ||
      new Date(this.expirationDateTime) <= this.dateTime
    ) {
      const expDate = new Date(this.dateTime);
      expDate.setDate(expDate.getDate() + 30);
      this.expirationDateTime = expDate;
    } else {
      this.expirationDateTime = new Date(this.expirationDateTime);
    }
  }
}
