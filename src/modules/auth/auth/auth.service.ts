import { Request, Response } from "express";
import { Client } from "../../client/client/client.entity.js";
import cookie from "cookie";
import { differenceInMinutes } from "date-fns";
import { environment } from "../../../config/env.config.js";
import { EnvironmentTypeEnum } from "../../../utils/enums/environment-type.enum.js";
import { HttpError } from "../../../utils/errors/http-error.js";
import { IToken } from "../../../utils/interfaces/token.interface.js";
import jwt from "jsonwebtoken";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";

const em = orm.em;
const blacklistedTokens = new Map();

export const authService = {
  startSession: (res: Response, user: Client | Trainer) => {
    const token = jwt.sign({ id: user.id }, environment.session.jwtSecret, {
      expiresIn: `${environment.session.durationInHours}h`,
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: environment.type === EnvironmentTypeEnum.PRODUCTION,
      sameSite: "strict",
      maxAge: environment.session.durationInHours * 3600000,
    });
  },

  decodeToken: (req: Request): IToken => {
    const token = req.cookies.auth_token;
    if (token) {
      if (blacklistedTokens.has(token)) {
        throw new HttpError(
          401,
          "No autorizado. El token se encuentra bloqueado."
        );
      }

      const decoded = jwt.verify(token, environment.session.jwtSecret) as {
        id: string;
        iat: number;
        exp: number;
      };

      return {
        rawToken: token,
        id: decoded.id,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    } else {
      throw new HttpError(401, "No autorizado. Token nulo.");
    }
  },

  getUser: async (
    req: Request
  ): Promise<{ user: Trainer | Client; isTrainer: boolean }> => {
    const token = authService.decodeToken(req);
    let isTrainer = true;
    let user: Trainer | Client | null;

    user = await em.findOne(Trainer, {
      id: token.id,
    });

    if (!user) {
      isTrainer = false;
      user = await em.findOneOrFail(Client, {
        id: token.id,
      });
    }

    return { isTrainer, user };
  },

  blackListToken: (token: IToken) => {
    const now = Date.now();
    for (const [blToken, expiryTime] of blacklistedTokens.entries()) {
      if (now > expiryTime) {
        blacklistedTokens.delete(blToken);
      }
    }

    blacklistedTokens.set(token.rawToken, token.exp * 1000);
  },

  refreshToken: (token: IToken, res: Response) => {
    if (
      differenceInMinutes(token.exp * 1000, new Date()) <
      environment.session.refreshTimeInMinutes
    ) {
      authService.blackListToken(token);

      const newToken = jwt.sign(
        { id: token.id },
        environment.session.jwtSecret,
        {
          expiresIn: `${environment.session.durationInHours}h`,
        }
      );

      res.cookie("auth_token", newToken, {
        httpOnly: true,
        secure: environment.type === EnvironmentTypeEnum.PRODUCTION,
        sameSite: "strict",
        maxAge: environment.session.durationInHours * 3600000,
      });
    }
  },

  decodeTokenFromWebsocket: async (cookies: string | undefined) => {
    if (!cookies) throw new Error("Token nulo.");

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.auth_token;

    if (!token) throw new Error("Token nulo.");

    if (blacklistedTokens.has(token)) {
      throw new Error("No autorizado. El token se encuentra bloqueado.");
    }

    const decoded = jwt.verify(token, environment.session.jwtSecret) as {
      id: string;
      iat: number;
      exp: number;
    };

    let user: Trainer | Client | null;
    const em = orm.em.fork();
    user = await em.findOne(Trainer, {
      id: decoded.id,
    });

    if (!user) {
      user = await em.findOneOrFail(Client, {
        id: decoded.id,
      });
    }

    return { decoded, user };
  },
};
