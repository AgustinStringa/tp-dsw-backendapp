import { NextFunction, Request, Response } from "express";

function sanitizeClient(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  //more checks about malicious content, sql injections, data type...

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

export { sanitizeClient };
