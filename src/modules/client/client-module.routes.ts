import { goalByClientRouter, goalRouter } from "./goal/goal.routes.js";
import {
  progressByClientRouter,
  progressRouter,
} from "./progress/progress.routes.js";
import { authMiddlewares } from "../auth/auth/auth.middlewares.js";
import { clientRouter } from "./client/client.routes.js";
import { controller as homeController } from "../home/home.controller.js";
import { Router } from "express";

export const clientsRouter = Router();

clientsRouter.use("/goals", goalRouter);
clientsRouter.use("/:clientId/goals", goalByClientRouter);

clientsRouter.use("/progresses", progressRouter);
clientsRouter.use("/:clientId/progresses", progressByClientRouter);

/**
 * @swagger
 * /api/clients/home:
 *   get:
 *     summary: Obtener información para el home del cliente autenticado
 *     operationId: getHomeInformationForClient
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Información obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
clientsRouter.get(
  "/home",
  authMiddlewares.verifyClient,
  homeController.getDataForClient
);

clientsRouter.use("/", clientRouter);
