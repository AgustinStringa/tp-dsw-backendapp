import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "PRODUCTION",
  "MONGO_URI",
  "EMAIL",
  "EMAIL_PASSWORD",
  "PORT",
  "BACKEND_URL",
  "FRONTEND_URL",
  "JWT_SECRET",
  "SESSION_DURATION_HOURS",
  "REFRESH_TIME_MINUTES",
  "STRIPE_API_KEY",
  "STRIPE_WEBHOOK",
];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

export const environment = {
  production: process.env.PRODUCTION === "true",
  mongoUri: process.env.MONGO_URI,
  systemUrls: {
    port: process.env.PORT,
    backendUrl: process.env.BACKEND_URL,
    frontendUrl: process.env.FRONTEND_URL,
  },
  emailAccount: {
    email: process.env.EMAIL,
    password: process.env.EMAIL_PASSWORD,
  },
  session: {
    jwtSecret: process.env.JWT_SECRET as string,
    durationInHours: Number(process.env.SESSION_DURATION_HOURS),
    refreshTimeInMinutes: Number(process.env.REFRESH_TIME_MINUTES),
  },
  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    webhook: process.env.STRIPE_WEBHOOK,
  },
};

if (
  !Number.isInteger(environment.session.durationInHours) ||
  environment.session.durationInHours < 1
)
  throw new Error("SESSION_DURATION_HOURS debe ser un número entero positivo.");

if (
  !Number.isInteger(environment.session.refreshTimeInMinutes) ||
  environment.session.refreshTimeInMinutes < 1
)
  throw new Error("REFRESH_TIME_MINUTES debe ser un número entero positivo.");
