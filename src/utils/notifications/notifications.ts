import nodemailer from "nodemailer";
import { environment } from "../../config/env.config.js";

const emailListDev = [
  "agustinstringa24@hotmail.com",
  "elias.danteo.tomas@hotmail.com",
  "aarondebernardo@gmail.com",
];

export const sendEmail = async (
  subject: string,
  htmlContent: string,
  receivers?: string[]
) => {
  receivers = receivers || emailListDev;

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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
