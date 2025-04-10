import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./trainer.controller.js";
import express from "express";
import { controller as homeController } from "../../home/home.controller.js";

export const trainerRouter = express.Router();

/**
 * @swagger
 * /api/trainers/home:
 *   get:
 *     summary: Obtener información para el home del entrenador autenticado
 *     operationId: getHomeInformationForTrainer
 *     tags:
 *       - Home
 *     security:
 *       - bearerAuth: []
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
trainerRouter.get(
  "/home",
  authMiddlewares.verifyTrainer,
  homeController.getDataForTrainer
);

/**
 * @swagger
 * /api/trainers/{id}:
 *   get:
 *     summary: Obtener un entrenador por ID
 *     operationId: getTrainerById
 *     tags:
 *       - Trainers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Entrenador encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Entrenador no encontrado
 *       500:
 *         description: Error en el servidor
 */
trainerRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/trainers/:
 *   get:
 *     summary: Obtener todos los entrenadores
 *     operationId: getAllTrainers
 *     tags:
 *       - Trainers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entrenadores obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
trainerRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/trainers/:
 *   post:
 *     summary: Crear un nuevo entrenador
 *     operationId: createTrainer
 *     tags:
 *       - Trainers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Entrenador creado exitosamente
 *       400:
 *         description: Datos inválidos o duplicados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
trainerRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeTrainer,
  controller.add
);

/**
 * @swagger
 * /api/trainers/{id}:
 *   put:
 *     summary: Actualizar completamente un entrenador
 *     operationId: updateTrainer
 *     tags:
 *       - Trainers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Entrenador actualizado exitosamente
 *       400:
 *         description: Datos inválidos o duplicados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Entrenador no encontrado
 *       500:
 *         description: Error en el servidor
 */
trainerRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeTrainer,
  controller.update
);

/**
 * @swagger
 * /api/trainers/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un entrenador
 *     operationId: patchTrainer
 *     tags:
 *       - Trainers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Entrenador actualizado parcialmente
 *       400:
 *         description: Datos inválidos o duplicados
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Entrenador no encontrado
 *       500:
 *         description: Error en el servidor
 */
trainerRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeTrainer,
  controller.update
);

/**
 * @swagger
 * /api/trainers/{id}:
 *   delete:
 *     summary: Eliminar un entrenador
 *     operationId: deleteTrainer
 *     tags:
 *       - Trainers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Entrenador eliminado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Entrenador no encontrado
 *       500:
 *         description: Error en el servidor
 */
trainerRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
