import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Client } from "../Client/Client.entity.js";
const em = orm.em;

const controller = {
  findClientsWithMemembership: async function (_: Request, res: Response) {
    try {
      const clients = await em.find(
        Client,
        {},
        {
          populate: ["memberships"],
        }
      );
      const clientsWithMembership = clients.filter((c) =>
        c.memberships.toArray().some((m) => m.dateTo == null)
      );
      res.status(200).json({
        message: "All clients with membership were found",
        data: clientsWithMembership,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeRoutine: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      month: req.body.month,
      year: req.body.year,
      trainer: req.body.trainer,
      client: req.body.client,
    };
    //more checks about malicious content, sql injections, data type...

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
        delete req.body.sanitizedInput[key];
      }
    });
    next();
  },
};

export { controller };
