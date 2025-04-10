import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./routine.controller.js";
import { Router } from "express";

export const routineRouter = Router();

/**
 * @swagger
 * /api/routines/{id}:
 *   get:
 *     summary: Obtener una rutina por ID
 *     operationId: getRoutineById
 *     tags:
 *       - Routines
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rutina encontrada
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Rutina no encontrada
 *       500:
 *         description: Error en el servidor
 */
routineRouter.get("/:id", authMiddlewares.verifyUser, controller.findOne);

/**
 * @swagger
 * /api/routines/:
 *   get:
 *     summary: Obtener todas las rutinas (solo entrenador)
 *     operationId: getAllRoutines
 *     tags:
 *       - Routines
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de rutinas obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       500:
 *         description: Error en el servidor
 */
routineRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/routines/:
 *   post:
 *     summary: Crear una nueva rutina (solo entrenador)
 *     operationId: createRoutine
 *     tags:
 *       - Routines
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Rutina creada exitosamente
 *       400:
 *         description: Datos inválidos o fechas incorrectas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       500:
 *         description: Error en el servidor
 */
routineRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeRoutine,
  controller.add
);

/**
 * @swagger
 * /api/routines/{id}:
 *   put:
 *     summary: Actualizar completamente una rutina (solo entrenador)
 *     operationId: updateRoutine
 *     tags:
 *       - Routines
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Rutina actualizada exitosamente
 *       400:
 *         description: Datos inválidos o fechas incorrectas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       404:
 *         description: Rutina no encontrada
 *       500:
 *         description: Error en el servidor
 */
routineRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeRoutine,
  controller.update
);

/**
 * @swagger
 * /api/routines/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una rutina (solo entrenador)
 *     operationId: patchRoutine
 *     tags:
 *       - Routines
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Rutina actualizada parcialmente
 *       400:
 *         description: Datos inválidos o fechas incorrectas
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       404:
 *         description: Rutina no encontrada
 *       500:
 *         description: Error en el servidor
 */
routineRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeRoutine,
  controller.update
);

/**
 * @swagger
 * /api/routines/{id}:
 *   delete:
 *     summary: Eliminar una rutina (solo entrenador)
 *     operationId: deleteRoutine
 *     tags:
 *       - Routines
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rutina eliminada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       404:
 *         description: Rutina no encontrada
 *       500:
 *         description: Error en el servidor
 */
routineRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);

export const routineByClientRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/clients/{clientId}/routines/current:
 *   get:
 *     summary: Obtener la rutina actual de un cliente
 *     operationId: getCurrentClientRoutine
 *     tags:
 *       - Routines
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rutina actual encontrada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (solo el cliente puede ver su rutina)
 *       404:
 *         description: No se encontró rutina actual
 *       500:
 *         description: Error en el servidor
 */
routineByClientRouter.get(
  "/current",
  authMiddlewares.verifyClient,
  controller.findCurrentRoutine
);
