import hbs from "nodemailer-express-handlebars";
import nodemailer from "nodemailer";
/**se podria crear una clase que maneje los envios de mensaje
. QUe se encargue de instanciar el transporter
con un metodo que reciba params para personalizar el mail enviado
- enviar mail cuando se registró en la página
- enviar mail cuando se da de alta una nueva clase
- enviar mail cuando se le asignó una nueva membresía/venció/está proxima a vencer
*/
const sendExampleEmail = async () => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "stringaagustin1@gmail.com",
      pass: "jvcs kmek zegv bvjc",
    },
  });
  var mailOptions = {
    from: "stringaagustin1@gmail.com",
    to: "elias.danteo.tomas@hotmail.com ",
    subject: "Sending Email using Node.js",
    text: "That was (not) easy!",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
