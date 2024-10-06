import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Client } from "../Client/Client.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Trainer } from "../Trainer/Trainer.entity.js";
import jwt from "jsonwebtoken";

const em = orm.em;
const JWT_SECRET = "your_jwt_secret";

const controller = {
  login: async function (req: Request, res: Response) {
    try {
      let user = undefined;
      let client = true;

      user = await em.findOne(Client, {
        email: req.body.sanitizedInput.email,
      });

      if (user === null) {
        user = await em.findOneOrFail(Trainer, {
          email: req.body.sanitizedInput.email,
        });
        client = false;
      }

      const auth = bcrypt.compareSync(
        req.body.sanitizedInput.password,
        user.password
      );

      if (auth) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          message: "Logged in successfully",
          data: { user, client, token },
        }); //no debería devolver la contraseña
      } else {
        return res.status(401).json({ message: "Wrong email or password" });
      }
    } catch (error: any) {
      if (error.message.match("not found"))
        res.status(401).json({ message: "Wrong email or password" });
      else res.status(500).json({ message: error.message });
    }
  },

  sanitizeLogin: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      email: req.body.email,
      password: req.body.password,
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });

    next();
  },

  verifyTrainer: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization?.replace(/^Bearer\s+/, "");
      if (token) {
        let decoded = jwt.verify(token, JWT_SECRET);
        decoded = decoded as { id: string; iat: number; exp: number };
        await em.findOneOrFail(Trainer, {
          id: decoded.id,
        });
        return next();
      }
      res.status(400).json({ message: "unauthorized. void token." });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  verifyClient: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization?.replace(/^Bearer\s+/, "");
      if (token) {
        let decoded = jwt.verify(token, JWT_SECRET);
        decoded = decoded as { id: string; iat: number; exp: number };
        await em.findOneOrFail(Client, {
          id: decoded.id,
        });
        return next();
      }
      res.status(401).json({ message: "unauthorized. void token." });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },

  verifyUser: async function (req: Request, res: Response, next: NextFunction) {
    try {
      // se podria analizar en un futuro si se pueden reutilizar las funciones creadas para verifyClient y verifyTrainer
      const token = req.headers.authorization?.replace(/^Bearer\s+/, "");
      if (token) {
        let decoded = jwt.verify(token, JWT_SECRET);
        decoded = decoded as { id: string; iat: number; exp: number };
        const client = await em.findOne(Client, {
          id: decoded.id,
        });
        if (client == null) {
          await em.findOneOrFail(Trainer, {
            id: decoded.id,
          });
        }
        return next();
      }
      res.status(401).json({ message: "unauthorized. void token." });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },
};

export { controller };
