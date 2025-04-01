import { Request, Response } from "express";
import { authService } from "../../auth/auth/auth.service.js";
import { Client } from "./client.entity.js";
import { sendEmail } from "../../../utils/notifications/notifications.js";

export const clientService = {
  startSessionOnRegister: (req: Request, res: Response, client: Client) => {
    let token;
    try {
      token = authService.decodeToken(req);
    } catch (error: unknown) {}

    if (token === undefined) {
      authService.startSession(res, client);
    }
  },

  sendRegistrationEmail: async (client: Client) => {
    sendEmail(
      "Registro exitoso en Gimnasio Iron Haven",
      `
        <h3>Felicitaciones. El registro en nuestra app se realizó exitosamente.</h3>
        <div>
          <p>Correo electrónico: ${client.email} (con él podrás iniciar sesión en nuestro sitio).</p>
          <p>Ahora puedes disfrutar de las funcionalidades de inscribirte a una clase, leer nuestras noticias y registrar tus progresos en el gimnasio.</p>
          <p>¡Más funcionalidades en construcción!</p>
          <p>¡Dirígite a nuestro <a href="https://www.ironheavengym.com.ar/">sitio web</a> para comenzar!</p>
        </div>
        <div style="color: #FF5733; font-size: 16px; font-weight: bold;">
          Gimnasio Iron Haven
        </div>
        `,
      [client.email]
    ).catch(() => {});
  },
};
