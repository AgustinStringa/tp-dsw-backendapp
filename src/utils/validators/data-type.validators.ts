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

export function validateEnum(
  value: any,
  enumType: any,
  fieldName: string,
  canBeUndefined: boolean = true
): any {
  if (!canBeUndefined && !value) {
    throw new HttpError(400, `El campo ${fieldName} es requerido.`);
  }

  if (canBeUndefined && !value) {
    return undefined;
  }

  value = value.toString().trim();
  const normalizedValue =
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  if (!Object.values(enumType).includes(normalizedValue)) {
    throw new HttpError(
      400,
      `El valor ingresado para ${fieldName} no es válido.`
    );
  }

  return normalizedValue;
}

export function validatePrice(
  price: number | string,
  maxDecimals: number,
  field: string,
  canBeUndefined: boolean,
  allowZero: boolean
) {
  if (canBeUndefined === true && price === undefined) return undefined;

  if (typeof price === "number" && price >= 0) {
    if (!allowZero && price === 0)
      throw new HttpError(400, `${field}: no se permite el valor 0.`);

    const roundedPrice = parseFloat(price.toFixed(maxDecimals));
    return roundedPrice;
  }

  const convertedPrice = Number(price);
  if (!isNaN(convertedPrice) && convertedPrice >= 0) {
    if (!allowZero && price === 0)
      throw new HttpError(400, `${field}: no se permite el valor 0.`);

    const roundedPrice = parseFloat(convertedPrice.toFixed(maxDecimals));
    return roundedPrice;
  }

  if (allowZero)
    throw new HttpError(
      400,
      `${field}: debe ser un número mayor o igual que 0.`
    );
  else throw new HttpError(400, `${field}: debe ser un número mayor que 0.`);
}
