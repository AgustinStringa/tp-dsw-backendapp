import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { Client } from "../Client/Client.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import { addHours } from "date-fns";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
  throw new Error("JWT_SECRET must be defined and be a string");
}

const blacklistedTokens = new Map();
const em = orm.em;

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
          expiresIn: "1h",
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
          data: { user: userReturn, token },
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
    const now = Date.now();
    for (const [token, expiryTime] of blacklistedTokens.entries()) {
      if (now > expiryTime) {
        blacklistedTokens.delete(token);
      }
    }

    const token = req.headers.authorization?.replace(/^Bearer\s+/, "");
    if (token) {
      const expiryTime = addHours(Date.now(), 1);
      blacklistedTokens.set(token, expiryTime);
      res.status(200).json({ message: "Logged out successfully." });
    } else {
      res.status(400).json({ message: "Void token." });
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
      const decoded = decodeToken(req);
      await em.findOneOrFail(Trainer, {
        id: decoded.id,
      });

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
      const decoded = decodeToken(req);
      await em.findOneOrFail(Client, {
        id: decoded.id,
      });

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
      const decoded = decodeToken(req);
      const client = await em.findOne(Client, {
        id: decoded.id, // TODO las probabilidades son ínfimas, pero un cliente puede tener el mismo id que un trainer. Una solución es identificarlos por email.
      });

      if (client === null) {
        await em.findOneOrFail(Trainer, {
          id: decoded.id,
        });
      }

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
    const decoded = decodeToken(req);
    let isTrainer = true;

    const found = await em.findOne(Trainer, {
      id: decoded.id,
    });

    if (!found) {
      isTrainer = false;
      await em.findOneOrFail(Client, {
        id: decoded.id,
      });
    }

    return { isTrainer: isTrainer, id: decoded.id };
  } catch (error: any) {
    if (error.message.match("not found")) return null;
    if (error.message.match("Unauthorized")) return null;
    else throw error;
  }
}

function decodeToken(req: Request): { id: string; iat: number; exp: number } {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, "");
  if (token) {
    if (blacklistedTokens.has(token)) {
      throw new Error("Unauthorized. Token is blacklisted.");
    }

    let decoded = jwt.verify(token, JWT_SECRET as string);
    return decoded as { id: string; iat: number; exp: number };
  } else {
    throw new Error("Unauthorized. Void token.");
  }
}

export { controller, getUser };
