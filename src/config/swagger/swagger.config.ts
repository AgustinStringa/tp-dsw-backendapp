import swaggerJsdoc from "swagger-jsdoc";

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
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./dist/**/*.routes.js"],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
