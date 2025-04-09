import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./goal.controller.js";
import { Router } from "express";

export const goalRouter = Router();

/**
 * @swagger
 * /api/clients/goals/{id}:
 *   get:
 *     summary: Obtener una meta
 *     operationId: getGoalById
 *     tags:
 *       - Metas
 *     responses:
 *       200:
 *         description: Meta encontrado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Meta no encontrada
 *       500:
 *         description: Error en el servidor
 */
goalRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/clients/goals/:
 *   get:
 *     summary: Obtener todas las metas
 *     operationId: getAllGoals
 *     tags:
 *       - Metas
 *     responses:
 *       200:
 *         description: Lista de metas obtenido exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
goalRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/clients/goals/:
 *   post:
 *     summary: Crear una nueva meta
 *     operationId: createGoal
 *     tags:
 *       - Metas
 *     responses:
 *       201:
 *         description: Meta creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
goalRouter.post(
  "/",
  authMiddlewares.verifyClient,
  controller.sanitizeGoal,
  controller.add
);

/**
 * @swagger
 * /api/clients/goals/{id}:
 *   put:
 *     summary: Actualizar una meta
 *     operationId: updateGoalById
 *     tags:
 *       - Metas
 *     responses:
 *       200:
 *         description: Meta actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Meta no encontrada
 *       500:
 *         description: Error en el servidor
 */
goalRouter.put(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeGoal,
  controller.update
);

/**
 * @swagger
 * /api/clients/goals/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una meta
 *     operationId: patchGoalById
 *     tags:
 *       - Metas
 *     responses:
 *       200:
 *         description: Meta actualizada parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Meta no encontrada
 *       500:
 *         description: Error en el servidor
 */
goalRouter.patch(
  "/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeGoal,
  controller.update
);

/**
 * @swagger
 * /api/clients/goals/{id}:
 *   delete:
 *     summary: Eliminar una meta
 *     operationId: deleteGoalById
 *     tags:
 *       - Metas
 *     responses:
 *       200:
 *         description: Meta eliminada exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Meta no encontrada
 *       500:
 *         description: Error en el servidor
 */
goalRouter.delete("/:id", authMiddlewares.verifyClient, controller.delete);

export const goalByClientRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/clients/{clientId}/goals/:
 *   get:
 *     summary: Obtener todas las metas de un cliente
 *     operationId: getGoalsByClient
 *     tags:
 *       - Metas
 *     responses:
 *       200:
 *         description: Metas obtenidas exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
goalByClientRouter.get(
  "/",
  authMiddlewares.verifyClient,
  controller.findByClient
);
