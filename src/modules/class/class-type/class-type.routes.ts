import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./class-type.controller.js";
import { Router } from "express";

export const classTypeRouter = Router();

/**
 * @swagger
 * /api/classes/types/{id}:
 *   get:
 *     summary: Obtener un tipo de clase
 *     operationId: getClassTypeById
 *     tags:
 *       - Tipos de Clases
 *     responses:
 *       200:
 *         description: Tipo de clase encontrado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tipo de clase no encontrado
 *       500:
 *         description: Error en el servidor
 */
classTypeRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/classes/types/:
 *   get:
 *     summary: Obtener todos los tipos de clases
 *     operationId: getAllClassTypes
 *     tags:
 *       - Tipos de Clases
 *     responses:
 *       200:
 *         description: Lista de tipos de clases obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
classTypeRouter.get("/", authMiddlewares.verifyUser, controller.findAll);

/**
 * @swagger
 * /api/classes/types/:
 *   post:
 *     summary: Crear un nuevo tipo de clase
 *     operationId: createClassType
 *     tags:
 *       - Tipos de Clases
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Tipo de clase creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
classTypeRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClassType,
  controller.add
);

/**
 * @swagger
 * /api/classes/types/{id}:
 *   put:
 *     summary: Actualizar un tipo de clase
 *     operationId: updateClassTypeById
 *     tags:
 *       - Tipos de Clases
 *     responses:
 *       200:
 *         description: Tipo de clase actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tipo de clase no encontrado
 *       500:
 *         description: Error en el servidor
 */
classTypeRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClassType,
  controller.update
);

/**
 * @swagger
 * /api/classes/types/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un tipo de clase
 *     operationId: patchClassTypeById
 *     tags:
 *       - Tipos de Clases
 *     responses:
 *       200:
 *         description: Tipo de clase actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tipo de clase no encontrado
 *       500:
 *         description: Error en el servidor
 */
classTypeRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClassType,
  controller.update
);

/**
 * @swagger
 * /api/classes/types/{id}:
 *   delete:
 *     summary: Eliminar un tipo de clase
 *     operationId: deleteClassTypeById
 *     tags:
 *       - Tipos de Clases
 *     responses:
 *       200:
 *         description: Tipo de clase eliminado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
classTypeRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
