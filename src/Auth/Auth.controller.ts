import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Client } from "../Client/Client.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Trainer } from "../Trainer/Trainer.entity.js";

const em = orm.em;

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
        return res
          .status(200)
          .json({ message: "Logged in successfully", data: { user, client } }); //no debería devolver la contraseña
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
};

export { controller };
