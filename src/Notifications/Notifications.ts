import nodemailer from "nodemailer";
/**se podria crear una clase que maneje los envios de mensaje
. QUe se encargue de instanciar el transporter
con un metodo que reciba params para personalizar el mail enviado
- enviar mail cuando se registró en la página
- enviar mail cuando se da de alta una nueva clase
- enviar mail cuando se le asignó una nueva membresía/venció/está proxima a vencer
*/
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
      user: "stringaagustin1@gmail.com",
      pass: "jvcs kmek zegv bvjc",
    },
  });
  const mailOptions = {
    from: "stringaagustin1@gmail.com",
    to: receivers,
    subject: subject,
    html: htmlContent,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
