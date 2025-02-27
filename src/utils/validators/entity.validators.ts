import { validateSync } from "class-validator";
import { HttpError } from "../errors/http-error.js";

export function validateEntity(entity: any) {
  const errors = validateSync(entity);
  if (errors.length > 0) {
    const firstError = errors[0];

    if (firstError.constraints) {
      const firstErrorMessage = Object.values(firstError.constraints)[0];
      throw new HttpError(400, firstErrorMessage);
    } else {
      throw new HttpError(400, "Bad request.");
    }
  }
}
