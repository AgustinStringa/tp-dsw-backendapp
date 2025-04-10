import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./membership-type.controller.js";
import { Router } from "express";

export const membershipTypeRouter = Router();

/**
 * @swagger
 * /api/membership/types/{id}:
 *   get:
 *     summary: Obtener un tipo de membresía
 *     operationId: getMembershipTypeById
 *     tags:
 *       - Tipos de Membresía
 *     responses:
 *       200:
 *         description: Tipo de membresía encontrado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tipo de membresía no encontrado
 *       500:
 *         description: Error en el servidor
 */
membershipTypeRouter.get(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.findOne
);

/**
 * @swagger
 * /api/membership/types/:
 *   get:
 *     summary: Obtener todos los tipos de membresía
 *     operationId: getAllMembershipTypes
 *     tags:
 *       - Tipos de Membresía
 *     responses:
 *       200:
 *         description: Lista de tipos de membresía obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
membershipTypeRouter.get("/", authMiddlewares.verifyUser, controller.findAll);

/**
 * @swagger
 * /api/membership/types/:
 *   post:
 *     summary: Crear un nuevo tipo de membresía
 *     operationId: createMembershipType
 *     tags:
 *       - Tipos de Membresía
 *     responses:
 *       201:
 *         description: Tipo de membresía creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
membershipTypeRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.add
);

/**
 * @swagger
 * /api/membership/types/{id}:
 *   put:
 *     summary: Actualizar un tipo de membresía
 *     operationId: updateMembershipTypeById
 *     tags:
 *       - Tipos de Membresía
 *     responses:
 *       200:
 *         description: Tipo de membresía actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tipo de membresía no encontrado
 *       500:
 *         description: Error en el servidor
 */
membershipTypeRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.update
);

/**
 * @swagger
 * /api/membership/types/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un tipo de membresía
 *     operationId: patchMembershipTypeById
 *     tags:
 *       - Tipos de Membresía
 *     responses:
 *       200:
 *         description: Tipo de membresía actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tipo de membresía no encontrado
 *       500:
 *         description: Error en el servidor
 */
membershipTypeRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembershipType,
  controller.update
);

/**
 * @swagger
 * /api/membership/types/{id}:
 *   delete:
 *     summary: Eliminar un tipo de membresía
 *     operationId: deleteMembershipTypeById
 *     tags:
 *       - Tipos de Membresía
 *     responses:
 *       200:
 *         description: Tipo de membresía eliminado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tipo de membresía no encontrado
 *       500:
 *         description: Error en el servidor
 */
membershipTypeRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
