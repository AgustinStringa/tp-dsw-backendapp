import { environment } from "../env.config.js";
import { EnvironmentTypeEnum } from "../../utils/enums/environment-type.enum.js";
import swaggerJsdoc from "swagger-jsdoc";

let swaggerDocs: object | null = null;

if (environment.type === EnvironmentTypeEnum.DEVELOPMENT) {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Gimnasio IronHaven",
        version: "1.0.0",
        description:
          "Documentación backend Gimnasio IronHaven - Trabajo Práctico Desarrollo de Software - UTN FRRo",
      },
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "auth_token",
          },
        },
      },
      servers: [
        { url: "http://localhost:3000" },
        { url: "https://gimnasio-iron-haven.onrender.com" },
      ],
    },
    apis: ["./dist/**/*.routes.js"],
  };

  swaggerDocs = swaggerJsdoc(swaggerOptions);
}

export { swaggerDocs };
