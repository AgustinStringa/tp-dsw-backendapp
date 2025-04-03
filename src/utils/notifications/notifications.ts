import { environment } from "../../config/env.config.js";
import { EnvironmentTypeEnum } from "../enums/environment-type.enum.js";
import nodemailer from "nodemailer";

const emailListDev = [
  "agustinstringa24@hotmail.com",
  "elias.danteo.tomas@hotmail.com",
  "aarondebernardo@gmail.com",
];

export const sendEmail = async (
  subject: string,
  htmlContent: string,
  receivers: string[]
) => {
  receivers =
    environment.type === EnvironmentTypeEnum.PRODUCTION
      ? receivers
      : emailListDev;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: environment.emailAccount.email,
      pass: environment.emailAccount.password,
    },
  });

  const mailOptions = {
    from: environment.emailAccount.email,
    to: receivers,
    subject: subject,
    html: htmlContent,
  };

  if (environment.type !== EnvironmentTypeEnum.PRODUCTION)
    await transporter.sendMail(mailOptions);
};
