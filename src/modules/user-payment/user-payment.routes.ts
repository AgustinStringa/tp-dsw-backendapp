import { authMiddlewares } from "../auth/auth/auth.middlewares.js";
import { controller } from "./user-payment.controller.js";
import { Router } from "express";

export const userPaymentRouter = Router();

/**
 * @swagger
 * /api/user-payment/:
 *   post:
 *     summary: Inicializar un pago con la integración de Stripe
 *     operationId: initiatePayment
 *     tags:
 *       - Pagos del Usuario
 *     responses:
 *       200:
 *         description: Pago inicializado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error en el servidor
 */
userPaymentRouter.post(
  "/",
  authMiddlewares.verifyClient,
  controller.sanitizeRequest,
  controller.initiatePayment
);

/**
 * @swagger
 * /api/user-payment/{checkoutSessionId}:
 *   post:
 *     summary: Procesar un pago ya iniciado con la integración de Stripe
 *     operationId: userFullfill
 *     tags:
 *       - Pagos del Usuario
 *     responses:
 *       200:
 *         description: Pago procesado correctamente
 *       401:
 *         description: No autenticado
 *       402:
 *         description: No se inicializó el Pago
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pago incializado no encontrado
 *       500:
 *         description: Error en el servidor
 */
userPaymentRouter.post(
  "/:checkoutSessionId",
  authMiddlewares.verifyClient,
  controller.userFullfill
);
