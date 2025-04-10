import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./payment.controller.js";
import { Router } from "express";

export const paymentRouter = Router();

/**
 * @swagger
 * /api/memberships/payments/:
 *   get:
 *     summary: Obtener todos los pagos
 *     operationId: getAllPayments
 *     tags:
 *       - Pagos
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
paymentRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/memberships/payments/{id}:
 *   get:
 *     summary: Obtener un pago
 *     operationId: getPaymentById
 *     tags:
 *       - Pagos
 *     responses:
 *       200:
 *         description: Pago encontrado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error en el servidor
 */
paymentRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/memberships/payments/:
 *   post:
 *     summary: Crear un nuevo pago
 *     operationId: createPayment
 *     tags:
 *       - Pagos
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
paymentRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizePayment,
  controller.add
);

/**
 * @swagger
 * /api/memberships/payments/{id}:
 *   put:
 *     summary: Actualizar un pago
 *     operationId: updatePaymentById
 *     tags:
 *       - Pagos
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error en el servidor
 */
paymentRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizePayment,
  controller.update
);

/**
 * @swagger
 * /api/memberships/payments/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un pago
 *     operationId: patchPaymentById
 *     tags:
 *       - Pagos
 *     responses:
 *       200:
 *         description: Pago actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error en el servidor
 */
paymentRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizePayment,
  controller.update
);

/**
 * @swagger
 * /api/memberships/payments/{id}:
 *   delete:
 *     summary: Eliminar un pago
 *     operationId: deletePaymentById
 *     tags:
 *       - Pagos
 *     responses:
 *       200:
 *         description: Pago eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error en el servidor
 */
paymentRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);

export const paymentByMembershipRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/memberships/{membershipId}/payments:
 *   get:
 *     summary: Obtener pagos de una membresía
 *     operationId: getPaymentsByMembership
 *     tags:
 *       - Pagos
 *     responses:
 *       200:
 *         description: Lista de pagos de la membresía obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Error en el servidor
 */
paymentByMembershipRouter.get("/", controller.findByMembership);
