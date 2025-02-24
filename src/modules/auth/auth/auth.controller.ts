import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { differenceInMinutes } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { Client } from "../../client/client/client.entity.js";
import { Trainer } from "../../trainer/trainer/trainer.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
  throw new Error("JWT_SECRET must be defined and be a string");
}

const sessionDurationInHours = 1;
const refreshTimeInMinutes = 10;
const blacklistedTokens = new Map();
const em = orm.em;

interface Token {
  rawToken: string;
  id: string;
  iat: number;
  exp: number;
}

const controller = {
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

      if (auth) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: `${sessionDurationInHours}h`,
        });

        res.cookie("auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: sessionDurationInHours * 3600000,
        });

        const userReturn = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          dni: user.dni,
          email: user.email,
          isClient,
        };

        return res.status(200).json({
          message: "Logged in successfully",
          data: { user: userReturn },
        });
      } else {
        return res.status(401).json({ message: "Wrong email or password" });
      }
    } catch (error: any) {
      if (error.message.match("not found"))
        res.status(401).json({ message: "Wrong email or password" });
      else res.status(500).json({ message: error.message });
    }
  },

  logout: async function name(req: Request, res: Response) {
    try {
      const token = decodeToken(req);

      blackListToken(token);

      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: sessionDurationInHours * 3600000,
      });

      res.status(200).json({ message: "Logged out successfully." });
    } catch {
      res.status(200).json({ message: "The session had already expired." });
    }
  },

  refresh: async function (req: Request, res: Response) {
    try {
      let user = undefined;
      let isClient = true;

      const token = decodeToken(req);

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

      refreshToken(token, res);

      return res.status(200).json({
        message: "Session extended.",
        data: { user: userReturn },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeLogin: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      email: req.body.email,
      password: req.body.password,
    };

    next();
  },

  verifyTrainer: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = decodeToken(req);
      await em.findOneOrFail(Trainer, {
        id: token.id,
      });

      refreshToken(token, res);
      return next();
    } catch (error: any) {
      if (error.message.match("Unauthorized"))
        res.status(401).json({ message: error.message });
      else if (error.message.match("not found"))
        res.status(401).json({ message: "Unauthorized." });
      else res.status(500).json({ message: error.message });
    }
  },

  verifyClient: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = decodeToken(req);
      await em.findOneOrFail(Client, {
        id: token.id,
      });

      refreshToken(token, res);
      return next();
    } catch (error: any) {
      if (error.message.match("Unauthorized"))
        res.status(401).json({ message: error.message });
      else if (error.message.match("not found"))
        res.status(401).json({ message: "Unauthorized." });
      else res.status(500).json({ message: error.message });
    }
  },

  verifyUser: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = decodeToken(req);
      const client = await em.findOne(Client, {
        id: token.id,
      });

      if (client === null) {
        await em.findOneOrFail(Trainer, {
          id: token.id,
        });
      }

      refreshToken(token, res);
      return next();
    } catch (error: any) {
      if (error.message.match("Unauthorized"))
        res.status(401).json({ message: error.message });
      else if (error.message.match("not found"))
        res.status(401).json({ message: "Unauthorized." });
      else res.status(500).json({ message: error.message });
    }
  },
};

async function getUser(
  req: Request
): Promise<{ isTrainer: boolean; id: string } | null> {
  try {
    const token = decodeToken(req);
    let isTrainer = true;

    const found = await em.findOne(Trainer, {
      id: token.id,
    });

    if (!found) {
      isTrainer = false;
      await em.findOneOrFail(Client, {
        id: token.id,
      });
    }

    return { isTrainer: isTrainer, id: token.id };
  } catch (error: any) {
    if (error.message.match("not found")) return null;
    if (error.message.match("Unauthorized")) return null;
    else throw error;
  }
}

function decodeToken(req: Request): Token {
  const token = req.cookies.auth_token;
  if (token) {
    if (blacklistedTokens.has(token)) {
      throw new Error("Unauthorized. Token is blacklisted.");
    }

    let decoded = jwt.verify(token, JWT_SECRET as string) as {
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
    throw new Error("Unauthorized. Void token.");
  }
}

function blackListToken(token: Token) {
  const now = Date.now();
  for (const [blToken, expiryTime] of blacklistedTokens.entries()) {
    if (now > expiryTime) {
      blacklistedTokens.delete(blToken);
    }
  }

  blacklistedTokens.set(token.rawToken, token.exp * 1000);
}

function refreshToken(token: Token, res: Response) {
  if (
    differenceInMinutes(token.exp * 1000, new Date()) < refreshTimeInMinutes
  ) {
    blackListToken(token);

    const newToken = jwt.sign({ id: token.id }, JWT_SECRET as string, {
      expiresIn: `${sessionDurationInHours}h`,
    });

    res.cookie("auth_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: sessionDurationInHours * 3600000,
    });
  }
}

export { controller, getUser };
