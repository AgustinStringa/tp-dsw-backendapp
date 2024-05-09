import { Response, Request, NextFunction } from "express";

/**
 * esta funcion puede optimizarse recibiendo como param las key a evaluar
 * de este modo puede reutilizarse para otras entidades
 */

function sanitizeTrainers(
  req: Request,
  res: Response,
  next: NextFunction
) {

  req.body.sanitizedInput = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
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
export { sanitizeTrainers };
