import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

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
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
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
