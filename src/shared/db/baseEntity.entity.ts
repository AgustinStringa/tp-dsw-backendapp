import { PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/mongodb";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;
}
