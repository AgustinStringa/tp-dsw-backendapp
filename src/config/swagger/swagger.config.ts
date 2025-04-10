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
    servers: [
      { url: "http://localhost:3000" },
      { url: "https://gimnasio-iron-haven.onrender.com" },
    ],
  },
  apis: ["./dist/**/*.routes.js"],
};

export const swaggerDocs = swaggerJsdoc(swaggerOptions);
