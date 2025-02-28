import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "../../config/db/base-entity.entity.js";
@Entity()
export class Message extends BaseEntity {
  @Property({ nullable: false })
  content!: string;

  @ManyToOne(() => BaseEntity)
  sender!: BaseEntity;

  @ManyToOne(() => BaseEntity)
  receiver!: BaseEntity;

  @Property({ nullable: false })
  createdAt!: Date;

  @Property({ nullable: true })
  readAt?: Date;
}
