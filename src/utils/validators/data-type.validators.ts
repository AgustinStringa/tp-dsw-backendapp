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

export function validateTime(time: any, field: string) {
  if (time === undefined) return undefined;

  const regex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

  if (regex.test(time)) return time;

  throw new HttpError(
    400,
    `${field}: debe ser un string en formato HH:MM. Valores admitidos entre las 00:00 y las 23:59.`
  );
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
