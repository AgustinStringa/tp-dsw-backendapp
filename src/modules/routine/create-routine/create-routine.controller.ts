import { Request, Response } from "express";
import { startOfDay } from "date-fns";
import { Membership } from "../../membership/membership/membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";

const em = orm.em;

const createRoutineController = {
  findActiveMememberships: async function (_: Request, res: Response) {
    try {
      const today = startOfDay(new Date());

      const memberships = await em.find(
        Membership,
        { $and: [{ dateFrom: { $lte: today } }, { dateTo: { $gt: today } }] },
        {
          populate: ["client", "type"],
          fields: [
            "dateFrom",
            "dateTo",
            "type.*",
            "client.id",
            "client.lastName",
            "client.firstName",
            "client.dni",
          ],
        }
      );

      return res.status(200).json({
        message: "All active memberships were found",
        data: memberships,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { createRoutineController };
