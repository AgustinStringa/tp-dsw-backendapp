import { addDays, format, startOfDay } from "date-fns";
import { Client } from "../../client/client/client.entity.js";
import { environment } from "../../../config/env.config.js";
import { HttpError } from "../../../utils/errors/http-error.js";
import { Membership } from "./membership.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { sendEmail } from "../../../utils/notifications/notifications.js";

const em = orm.em;

export const membershipService = {
  checkActiveMembership: async (client: Client) => {
    const membership = await em.findOne(Membership, {
      client: client,
      dateFrom: { $lte: new Date() },
      dateTo: { $gt: new Date() },
    });

    if (!membership)
      throw new HttpError(400, "El cliente no tiene una membresía activa.");
  },

  calcleClientDebt: async (client: Client) => {
    const membership = await em.findOne(Membership, {
      client: client,
      debt: { $gt: 0 },
    });

    return membership?.debt || 0;
  },

  sendMembershipExpirationsNotification: async () => {
    const tomorrow = startOfDay(addDays(new Date(), 1));

    const memberships = await orm.em
      .fork()
      .find(Membership, { dateTo: tomorrow }, { populate: ["client", "type"] });
    memberships.forEach((m) => sendMembershipExpirationEmail(m));
  },
};

async function sendMembershipExpirationEmail(membership: Membership) {
  const tomorrow = format(addDays(new Date(), 1), "dd-MM-yyyy");

  sendEmail(
    "Vencimiento de Membresía en Gimnasio Iron Haven",
    `
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #007bff;">Estimado/a ${membership.client.firstName},</h2>
          
          <p>Te escribimos para recordarte que tu membresía <strong>${membership.type.name}</strong> expirará mañana, 
            <strong>${tomorrow} a las 00:00</strong>.</p>
          
          <p>Si deseas continuar disfrutando de nuestros servicios, te invitamos a renovar tu membresía con cualquiera 
          de nuestros entrenadores o a través de nuestro sitio web.</p>

          <p>Si ya has renovado tu membresía o si este mensaje es un error, por favor contáctanos para solucionarlo.</p>

          <p>Gracias por ser parte de nuestra comunidad, y esperamos seguir brindándote nuestros servicios.</p>

          <p>Saludos cordiales,</p>
          
          <div style="color: #FF5733; font-size: 16px; font-weight: bold;">
            Gimnasio Iron Haven
          </div>
        
          <p><a href="${environment.systemUrls.frontendUrl}" style="color: #007bff;">Haz clic aquí para renovar tu membresía</a></p>

        </div>
      </body>
    `,
    [membership.client.email]
  ).catch(() => {});
}
