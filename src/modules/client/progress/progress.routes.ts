import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./progress.controller.js";
import { Router } from "express";

export const progressRouter = Router();

/**
 * @swagger
 * /api/clients/progress/{id}:
 *   get:
 *     summary: Obtener un progreso
 *     operationId: getProgressById
 *     tags:
 *       - Progresos
 *     responses:
 *       200:
 *         description: Progreso encontrado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error en el servidor
 */
progressRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/clients/progress/:
 *   get:
 *     summary: Obtener todos los progresos
 *     operationId: getAllProgresses
 *     tags:
 *       - Progresos
 *     responses:
 *       200:
 *         description: Lista de progresos obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
progressRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/clients/progress/:
 *   post:
 *     summary: Crear un nuevo progreso
 *     operationId: createProgress
 *     tags:
 *       - Progresos
 *     responses:
 *       201:
 *         description: Progreso creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
progressRouter.post(
  "/",
  authMiddlewares.verifyClient,
  controller.sanitizeProgress,
  controller.add
);

/**
 * @swagger
 * /api/clients/progress/{id}:
 *   put:
 *     summary: Actualizar un progreso
 *     operationId: updateProgressById
 *     tags:
 *       - Progresos
 *     responses:
 *       200:
 *         description: Progreso actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error en el servidor
 */
progressRouter.put(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeProgress,
  controller.update
);

/**
 * @swagger
 * /api/clients/progress/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un progreso
 *     operationId: patchProgressById
 *     tags:
 *       - Progresos
 *     responses:
 *       200:
 *         description: Progreso actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error en el servidor
 */
progressRouter.patch(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeProgress,
  controller.update
);

/**
 * @swagger
 * /api/clients/progress/{id}:
 *   delete:
 *     summary: Eliminar un progreso
 *     operationId: deleteProgressById
 *     tags:
 *       - Progresos
 *     responses:
 *       200:
 *         description: Progreso eliminado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Progreso no encontrado
 *       500:
 *         description: Error en el servidor
 */
progressRouter.delete("/:id", authMiddlewares.verifyClient, controller.delete);

export const progressByClientRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/clients/{clientId}/progress/:
 *   get:
 *     summary: Obtener todos los progresos de un cliente
 *     operationId: getProgressByClient
 *     tags:
 *       - Progresos
 *     responses:
 *       200:
 *         description: Progresos obtenidos exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
progressByClientRouter.get(
  "/",
  authMiddlewares.verifyClient,
  controller.findByClient
);
