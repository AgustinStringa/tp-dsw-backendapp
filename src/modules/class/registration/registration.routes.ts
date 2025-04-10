import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./registration.controller.js";
import { Router } from "express";

export const registrationRouter = Router();

/**
 * @swagger
 * /api/classes/registration/client/{clientId}:
 *   get:
 *     summary: Obtener todas las inscripciones de un cliente
 *     operationId: getRegistrationsByClient
 *     tags:
 *       - Inscripciones
 *     responses:
 *       200:
 *         description: Lista de inscripciones del cliente obtenida exitosamente
 *       400:
 *         description: ID de cliente inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
registrationRouter.get(
  "/client/:clientId",
  authMiddlewares.verifyClient,
  controller.findByClient
);

/**
 * @swagger
 * /api/classes/registration/{id}:
 *   get:
 *     summary: Obtener una inscripción
 *     operationId: getRegistrationById
 *     tags:
 *       - Inscripciones
 *     responses:
 *       200:
 *         description: Inscripción obtenida exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Inscripción no encontrada
 *       500:
 *         description: Error en el servidor
 */
registrationRouter.get(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.findOne
);

/**
 * @swagger
 * /api/classes/registration/:
 *   get:
 *     summary: Obtener todas las inscripciones
 *     operationId: getAllRegistrations
 *     tags:
 *       - Inscripciones
 *     responses:
 *       200:
 *         description: Lista de inscripciones obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
registrationRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/classes/registration/:
 *   post:
 *     summary: Crear una nueva inscripción
 *     operationId: createRegistration
 *     tags:
 *       - Inscripciones
 *     responses:
 *       201:
 *         description: Inscripción creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
registrationRouter.post(
  "/",
  authMiddlewares.verifyUser,
  controller.sanitizeRegistration,
  controller.add
);

/**
 * @swagger
 * /api/classes/registration/{id}/cancel:
 *   patch:
 *     summary: Cancelar una inscripción
 *     operationId: cancelRegistration
 *     tags:
 *       - Inscripciones
 *     responses:
 *       200:
 *         description: Inscripción cancelada exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Inscripción no encontrada
 *       500:
 *         description: Error en el servidor
 */
registrationRouter.patch(
  "/:id/cancel",
  authMiddlewares.verifyUser,
  controller.cancel
);
