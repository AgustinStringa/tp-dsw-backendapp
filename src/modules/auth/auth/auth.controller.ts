import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import bcrypt from "bcrypt";
import { Client } from "../../client/client/client.entity.js";
import { environment } from "../../../config/env.config.js";
import { EnvironmentTypeEnum } from "../../../utils/enums/environment-type.enum.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { NotFoundError } from "@mikro-orm/core";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";

const em = orm.em;

export const controller = {
  login: async function (req: Request, res: Response) {
    try {
      let user = undefined;
      let isClient = true;

      user = await em.findOne(Client, {
        email: req.body.sanitizedInput.email,
      });

      if (user === null) {
        user = await em.findOneOrFail(Trainer, {
          email: req.body.sanitizedInput.email,
        });
        isClient = false;
      }

      const auth = bcrypt.compareSync(
        req.body.sanitizedInput.password,
        user.password
      );

      if (!auth) {
        return res
          .status(401)
          .json({ message: "Email y/o contraseña incorrectos." });
      }

      authService.startSession(res, user);

      const userReturn = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dni: user.dni,
        email: user.email,
        isClient,
      };

      return res.status(200).json({
        message: "Sesión iniciada.",
        data: { user: userReturn },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundError)
        res.status(401).json({ message: "Email y/o contraseña incorrectos." });
      else handleError(error, res);
    }
  },

  logout: async function (req: Request, res: Response) {
    try {
      const token = authService.decodeToken(req);

      authService.blackListToken(token);

      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: environment.type === EnvironmentTypeEnum.PRODUCTION,
        sameSite: "strict",
      });

      res.status(200).json({ message: "Sesión finalizada." });
    } catch {
      res.status(200).json({ message: "La sesión expiró previamente." });
    }
  },

  refresh: async function (req: Request, res: Response) {
    try {
      let user = undefined;
      let isClient = true;

      const token = authService.decodeToken(req);

      user = await em.findOne(Client, {
        id: token.id,
      });

      if (user === null) {
        user = await em.findOneOrFail(Trainer, {
          id: token.id,
        });
        isClient = false;
      }

      const userReturn = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        dni: user.dni,
        email: user.email,
        isClient,
      };

      authService.refreshToken(token, res);

      return res.status(200).json({
        message: "Sesión extendida.",
        data: { user: userReturn },
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundError)
        res.status(401).json({ message: "No autorizado." });
      else handleError(error, res);
    }
  },

  sanitizeLogin: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      email: req.body.email,
      password: req.body.password,
    };

    next();
  },
};
