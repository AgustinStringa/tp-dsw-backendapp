import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./exercise.controller.js";
import express from "express";

export const exerciseRouter = express.Router();

/**
 * @swagger
 * /api/routines/exercises/{id}:
 *   get:
 *     summary: Obtener un ejercicio por ID
 *     operationId: getExerciseById
 *     tags:
 *       - Ejercicios
 *     responses:
 *       200:
 *         description: Ejercicio encontrado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error en el servidor
 */
exerciseRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/routines/exercises/:
 *   get:
 *     summary: Obtener todos los ejercicios
 *     operationId: getAllExercises
 *     tags:
 *       - Ejercicios
 *     responses:
 *       200:
 *         description: Lista de ejercicios obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
exerciseRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/routines/exercises/:
 *   post:
 *     summary: Crear un nuevo ejercicio
 *     operationId: createExercise
 *     tags:
 *       - Ejercicios
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Ejercicio creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
exerciseRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExercise,
  controller.add
);

/**
 * @swagger
 * /api/routines/exercises/{id}:
 *   put:
 *     summary: Actualizar completamente un ejercicio
 *     operationId: updateExercise
 *     tags:
 *       - Ejercicios
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Ejercicio actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error en el servidor
 */
exerciseRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);

/**
 * @swagger
 * /api/routines/exercises/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un ejercicio
 *     operationId: patchExercise
 *     tags:
 *       - Ejercicios
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Ejercicio actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Ejercicio no encontrado
 *       500:
 *         description: Error en el servidor
 */
exerciseRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeExercise,
  controller.update
);

/**
 * @swagger
 * /api/routines/exercises/{id}:
 *   delete:
 *     summary: Eliminar un ejercicio
 *     operationId: deleteExercise
 *     tags:
 *       - Ejercicios
 *     responses:
 *       200:
 *         description: Ejercicio eliminado exitosamente
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
exerciseRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
