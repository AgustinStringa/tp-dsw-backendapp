import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./class.controller.js";
import { Router } from "express";

export const classRouter = Router();

/**
 * @swagger
 * /api/classes/active:
 *   get:
 *     summary: Obtener clases activas
 *     operationId: findActiveClasses
 *     tags:
 *       - Clases
 *     responses:
 *       200:
 *         description: Lista de clases activas obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
classRouter.get("/active", authMiddlewares.verifyUser, controller.findActive);

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Obtener una clase
 *     operationId: getClassById
 *     tags:
 *       - Clases
 *     responses:
 *       200:
 *         description: Clase encontrada exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error en el servidor
 */
classRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/classes/:
 *   get:
 *     summary: Obtener todas las clases
 *     operationId: getAllClasses
 *     tags:
 *       - Clases
 *     responses:
 *       200:
 *         description: Lista de clases obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
classRouter.get("/", authMiddlewares.verifyUser, controller.findAll);

/**
 * @swagger
 * /api/classes/:
 *   post:
 *     summary: Crear una nueva clase
 *     operationId: createClass
 *     tags:
 *       - Clases
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Clase creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
classRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClass,
  controller.add
);

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Actualizar una clase
 *     operationId: updateClassById
 *     tags:
 *       - Clases
 *     responses:
 *       200:
 *         description: Clase actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error en el servidor
 */
classRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClass,
  controller.update
);

/**
 * @swagger
 * /api/classes/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una clase
 *     operationId: patchClassById
 *     tags:
 *       - Clases
 *     responses:
 *       200:
 *         description: Clase actualizada parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error en el servidor
 */
classRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClass,
  controller.update
);

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Eliminar una clase
 *     operationId: deleteClassById
 *     tags:
 *       - Clases
 *     responses:
 *       200:
 *         description: Clase eliminada exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Clase no encontrada
 *       500:
 *         description: Error en el servidor
 */
classRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
