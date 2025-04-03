import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { authService } from "./auth.service.js";
import { Client } from "../../client/client/client.entity.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { NotFoundError } from "@mikro-orm/core";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";

const em = orm.em;

export const authMiddlewares = {
  verifyTrainer: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = authService.decodeToken(req);
      await em.findOneOrFail(Trainer, {
        id: token.id,
      });

      authService.refreshToken(token, res);
      return next();
    } catch (error: unknown) {
      if (error instanceof NotFoundError)
        res.status(401).json(new ApiResponse("Unauthorized.", null, false));
      else handleError(error, res);
    }
  },

  verifyClient: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = authService.decodeToken(req);
      await em.findOneOrFail(Client, {
        id: token.id,
      });

      authService.refreshToken(token, res);
      return next();
    } catch (error: unknown) {
      if (error instanceof NotFoundError)
        res.status(401).json(new ApiResponse("Unauthorized.", null, false));
      else handleError(error, res);
    }
  },

  verifyUser: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await authService.getUser(req);

      const token = authService.decodeToken(req);
      authService.refreshToken(token, res);

      return next();
    } catch (error: unknown) {
      if (error instanceof NotFoundError)
        res.status(401).json(new ApiResponse("Unauthorized.", null, false));
      else handleError(error, res);
    }
  },
};
