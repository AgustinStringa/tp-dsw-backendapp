import { Response, Request, NextFunction } from "express";

/**
 * esta funcion puede optimizarse recibiendo como param las key a evaluar
 * de este modo puede reutilizarse para otras entidades
 */

function sanitizeMembershipType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const created = req.body.created_to || undefined;
  const updated = req.body.updated_to || req.body.price;
  let updated_date;
  if (updated && req.body.updated_to) {
    updated_date = new Date(req.body.updated_to);
  } else if (updated && !req.body.updated_to) {
    updated_date = new Date();
  } else {
    updated_date = undefined;
  }

  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    created_to: created ? new Date(req.body.created_to) : undefined,
    updated_to: updated_date,
  };
  //more checks here, data type, malicius content, operations, etc

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      //!req.body.sanitized podria hacer true algun valor falsy como null, que en algun contexto puede ser no deseado
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}
export { sanitizeMembershipType };
