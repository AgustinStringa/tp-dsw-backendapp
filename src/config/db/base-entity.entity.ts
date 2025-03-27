import { Entity, PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/mongodb";
import { ObjectId } from "@mikro-orm/mongodb";

@Entity()
export abstract class BaseEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;
}
