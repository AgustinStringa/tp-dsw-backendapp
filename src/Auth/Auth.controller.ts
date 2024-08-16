import { Request, Response, NextFunction } from "express";
import { Client } from "../Client/Client.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import bcrypt from "bcrypt";
const em = orm.em;

const controller = {
  login: async function (req: Request, res: Response) {
    try {
      const client = await em.findOneOrFail(
        Client,
        { username: req.body.sanitizedInput.username },
        { populate: ["progresses", "goals"] }
      );
      if (client != null) {
        const auth = bcrypt.compareSync(
          req.body.sanitizedInput.password,
          client.password
        );
        if (auth) {
          return res
            .status(200)
            .json({ message: "logged successfully", data: client });
        } else {
          return res
            .status(200)
            .json({ message: "username or password wrong" });
        }
      } else {
        return res.status(404).json({ message: "client not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  sanitizeLogin: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      username: req.body.username,
      password: req.body.password,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });
    next();
  },
  hashPassword: function (req: Request, res: Response, next: NextFunction) {
    if (req.body.sanitizedInput.password) {
      req.body.sanitizedInput.password = bcrypt.hashSync(
        req.body.sanitizedInput.password,
        10
      );
    }
    next();
  },
};

export { controller };
