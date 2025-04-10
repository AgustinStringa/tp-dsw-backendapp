import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./exercise-routine.controller.js";
import { Router } from "express";

export const exerciseRoutineRouter = Router();

/**
 * @swagger
 * /api/routines/exerciseroutines/:
 *   post:
 *     summary: Agregar un ejercicio a una rutina
 *     operationId: addExerciseToRoutine
 *     tags:
 *       - EjercicioRutina
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Ejercicio agregado a la rutina exitosamente
 *       400:
 *         description: Datos inválidos o rutina/ejercicio no encontrados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       500:
 *         description: Error en el servidor
 */
exerciseRoutineRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.add
);

/**
 * @swagger
 * /api/routines/exerciseroutines/{id}:
 *   put:
 *     summary: Actualizar completamente un ejercicio en una rutina
 *     operationId: updateExerciseRoutine
 *     tags:
 *       - EjercicioRutina
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Ejercicio en rutina actualizado exitosamente
 *       400:
 *         description: Datos inválidos o rutina/ejercicio no encontrados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       404:
 *         description: Ejercicio en rutina no encontrado
 *       500:
 *         description: Error en el servidor
 */
exerciseRoutineRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.update
);

/**
 * @swagger
 * /api/routines/exerciseroutines/{id}/record-execution/:
 *   patch:
 *     summary: Registrar la ejecución de un ejercicio por el cliente
 *     operationId: recordExerciseExecution
 *     tags:
 *       - EjercicioRutina
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Ejecución del ejercicio registrada exitosamente
 *       400:
 *         description: Peso inválido o rutina ya finalizada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (solo el cliente puede registrar su ejecución)
 *       404:
 *         description: Ejercicio en rutina no encontrado
 *       500:
 *         description: Error en el servidor
 */
exerciseRoutineRouter.patch(
  "/:id/record-execution/",
  authMiddlewares.verifyClient,
  controller.sanitizeExecution,
  controller.markAsDone
);

/**
 * @swagger
 * /api/routines/exerciseroutines/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un ejercicio en una rutina (entrenador)
 *     operationId: patchExerciseRoutine
 *     tags:
 *       - EjercicioRutina
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Ejercicio en rutina actualizado parcialmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExerciseRoutine'
 *       400:
 *         description: Datos inválidos o rutina/ejercicio no encontrados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       404:
 *         description: Ejercicio en rutina no encontrado
 *       500:
 *         description: Error en el servidor
 */
exerciseRoutineRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExerciseRoutine,
  controller.update
);

/**
 * @swagger
 * /api/routines/exerciseroutines/{id}:
 *   delete:
 *     summary: Eliminar un ejercicio de una rutina
 *     operationId: deleteExerciseRoutine
 *     tags:
 *       - EjercicioRutina
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ejercicio eliminado de la rutina exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado (requiere ser entrenador)
 *       404:
 *         description: Ejercicio en rutina no encontrado
 *       500:
 *         description: Error en el servidor
 */
exerciseRoutineRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
