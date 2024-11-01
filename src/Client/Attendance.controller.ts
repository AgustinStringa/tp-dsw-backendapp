import { NextFunction, Request, Response } from "express";
import { startOfDay } from "date-fns";
import { Attendance } from "./Attendance.entity.js";
import { Client } from "./Client.entity.js";
import { Membership } from "../Membership/Membership.entity.js";
import { orm } from "../shared/db/mikro-orm.config.js";

const em = orm.em;

const controller = {
  add: async function (req: Request, res: Response) {
    try {
      const client = await em.findOneOrFail(Client, {
        dni: req.body.sanitizedInput.dni,
      });

      const membership = await em.findOne(
        Membership,
        {
          client: client,
          dateTo: { $gt: new Date() },
        },
        { populate: ["type"] }
      );

      if (!membership)
        return res
          .status(403) // TODO: Es adecuado el código?
          .json({
            message: "The client does not have an active membership.",
          });

      const attendance = em.create(Attendance, { client: client });
      await em.flush();

      const todayCount = await em.count(Attendance, {
        client: client,
        dateTime: { $gte: startOfDay(new Date()) },
      });

      const dataReturn = {
        todayCount,
        attendance: { dateTime: attendance.dateTime },
        client: { firstName: client.firstName, lastName: client.lastName },
        membership: {
          dateFrom: membership.dateFrom,
          dateTo: membership.dateTo,
          type: membership.type.name,
        },
      };

      res.status(201).json({
        message: "Attendance registered",
        data: dataReturn,
      });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  sanitizeAttendance: function (
    req: Request,
    _res: Response,
    next: NextFunction
  ) {
    req.body.sanitizedInput = {
      dni: req.body.dni?.toString().trim(),
    };

    next();
  },
};

export { controller };
