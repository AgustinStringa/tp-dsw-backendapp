import { Request, Response } from "express";
import { ApiResponse } from "../../utils/classes/api-response.class.js";
import { authService } from "../auth/auth/auth.service.js";
import { ClientHomeDTO } from "./client-home.dto.js";
import { Goal } from "../client/goal/goal.entity.js";
import { handleError } from "../../utils/errors/error-handler.js";
import { Membership } from "../membership/membership/membership.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Progress } from "../client/progress/progress.entity.js";
import { Registration } from "../class/registration/registration.entity.js";

const em = orm.em;

export const controller = {
  getDataForClient: async function (req: Request, res: Response) {
    try {
      const client = (await authService.getUser(req)).user;

      const goalsCount = await em.count(Goal, { client, done: false });
      const progressesCount = await em.count(Progress, { client });
      const registrationsCount = await em.count(Registration, {
        client,
        cancelDateTime: null,
      });

      const currentMembership = await em.findOne(
        Membership,
        {
          client,
          dateFrom: { $lte: new Date() },
          dateTo: { $gt: new Date() },
        },
        { populate: ["type"] }
      );

      const data = new ClientHomeDTO(
        goalsCount,
        progressesCount,
        registrationsCount,
        currentMembership
      );

      res
        .status(200)
        .json(new ApiResponse("Información del cliente encontrada.", data));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },
};
