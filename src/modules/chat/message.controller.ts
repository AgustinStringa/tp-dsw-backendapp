import { Request, Response } from "express";
import { ApiResponse } from "../../utils/classes/api-response.class.js";
import { authService } from "../auth/auth/auth.service.js";
import { Client } from "../client/client/client.entity.js";
import { handleError } from "../../utils/errors/error-handler.js";
import { Message } from "./message.entity.js";
import { orm } from "../../config/db/mikro-orm.config.js";
import { Trainer } from "../trainer/trainer/trainer.entity.js";
import { validateObjectId } from "../../utils/validators/data-type.validators.js";

const em = orm.em;

export const messageController = {
  getRecipients: async (req: Request, res: Response) => {
    try {
      const userId = (await authService.getUser(req)).user.id;

      type Recipient = {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        userType: string;
      };

      const clients: Recipient[] = (
        await em.find(
          Client,
          { id: { $ne: userId } },
          {
            fields: ["id", "firstName", "lastName", "email"],
          }
        )
      ).map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        userType: "client",
      }));

      const trainers: Recipient[] = (
        await em.find(
          Trainer,
          { id: { $ne: userId } },
          {
            fields: ["id", "firstName", "lastName", "email"],
          }
        )
      ).map((t) => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        email: t.email,
        userType: "trainer",
      }));

      const recipients: Recipient[] = trainers.concat(clients);

      recipients.sort((a, b) => {
        if (a.firstName === b.firstName) {
          return a.lastName.localeCompare(b.lastName);
        }
        return a.firstName.localeCompare(b.firstName);
      });

      res
        .status(200)
        .json(
          new ApiResponse("Se encontraron los posibles receptores.", recipients)
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  getMessagesWithUser: async (req: Request, res: Response) => {
    try {
      const user1 = (await authService.getUser(req)).user;
      const user2 = validateObjectId(req.params.userId, "userId");

      const messages = await em.find(
        Message,
        {
          $or: [
            { sender: user1, receiver: user2 },
            { sender: user2, receiver: user1 },
          ],
        },
        { orderBy: { createdAt: "ASC" } }
      );

      return res
        .status(200)
        .json(new ApiResponse("Mensajes encontrados.", messages));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  getUnreadMessages: async (req: Request, res: Response) => {
    try {
      const user1 = (await authService.getUser(req)).user;

      const unreadMessages = await em.find(
        Message,
        {
          receiver: user1,
          readAt: undefined,
        },
        { orderBy: { createdAt: "ASC" } }
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            "Se encontraron los mensajes no leídos.",
            unreadMessages
          )
        );
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  markMessagesAsRead: async (req: Request, res: Response) => {
    try {
      const receiver = (await authService.getUser(req)).user;
      const sender = validateObjectId(req.params.userId, "userId");

      const readAt = new Date();

      await em.nativeUpdate(
        Message,
        { sender, receiver, readAt: undefined },
        { readAt }
      );

      return res
        .status(200)
        .json(new ApiResponse("Mensajes marcados como leídos."));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },
};
