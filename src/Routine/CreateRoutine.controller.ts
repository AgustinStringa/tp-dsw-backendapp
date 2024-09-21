import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/mikro-orm.config.js";
import { Client } from "../Client/Client.entity.js";
import { startOfDay } from "date-fns";
import { Membership } from "../Membership/Membership.entity.js";
import { ObjectId } from "@mikro-orm/mongodb";
const em = orm.em;

const createRoutineController = {
  findClientsWithMemembership: async function (_: Request, res: Response) {
    try {
      const clients = await em.find(
        Client,
        {},
        {
          populate: ["memberships", "memberships.type"],
        }
      );
      const today = startOfDay(new Date());
      let clientsWithMembership = clients.filter((c) =>
        c.memberships
          .toArray()
          .some(
            (m) =>
              today >= startOfDay(m.dateFrom) && startOfDay(m.dateTo) >= today
          )
      );
      let clientsWithLastMembership: {
        id: ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        dni: string;
        currentMembership: Membership;
      }[] = [];
      for (const c of clientsWithMembership) {
        const currentMembership = await em.findOne(Membership, {
          client: { $eq: c.id },
          dateFrom: { $lte: today },
          dateTo: { $gte: today },
        });

        if (currentMembership != null) {
          const client = {
            id: c._id,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            dni: c.dni,
            currentMembership: currentMembership,
          };
          clientsWithLastMembership.push(client);
        }
      }
      res.status(200).json({
        message: "All clients with membership were found",
        data: clientsWithLastMembership,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export { createRoutineController };
