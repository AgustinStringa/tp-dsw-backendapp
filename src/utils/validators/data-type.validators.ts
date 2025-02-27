import { ObjectId } from "@mikro-orm/mongodb";
import { HttpError } from "../errors/http-error.js";

export function validateObjectId(
  id: any,
  field: string,
  canBeUndefined: boolean = false
) {
  if (id === undefined && canBeUndefined) return undefined;

  if (typeof id === "string" && ObjectId.isValid(id)) return id;

  throw new HttpError(400, `${field}: must be an ObjectId.`);
}

export function validateDateTime(dateTime: any, field: string) {
  if (dateTime === undefined) return undefined;

  const aux = new Date(dateTime);
  if (!isNaN(aux.getTime())) return aux;

  throw new HttpError(
    400,
    `${field}: debe ser un string en formato YYYY-MM-DDTHH:mm:ss.sssZ`
  );
}
