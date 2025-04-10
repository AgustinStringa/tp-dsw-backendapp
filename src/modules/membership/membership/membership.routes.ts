import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./membership.controller.js";
import { Router } from "express";

export const membershipRouter = Router();

/**
 * @swagger
 * /api/memberships/active/:
 *   get:
 *     summary: Obtener membresías activas
 *     operationId: findActiveMemberships
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Lista de membresías activas obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.get(
  "/active/",
  authMiddlewares.verifyTrainer,
  controller.findActive
);

/**
 * @swagger
 * /api/memberships/active/clients/{clientId}:
 *   get:
 *     summary: Obtener la membresía activa de un cliente
 *     operationId: findActiveMembershipsByClient
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Membresía activa del cliente obtenida exitosamente
 *       400:
 *         description: ID de cliente inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente o membresía no encontrada
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.get(
  "/active/clients/:clientId",
  authMiddlewares.verifyClient,
  controller.findActiveByClient
);

/**
 * @swagger
 * /api/memberships/outstanding:
 *   get:
 *     summary: Obtener membresías adeudadas
 *     operationId: findOutstandingMemberships
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Lista de membresías adeudadas obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.get(
  "/outstanding",
  authMiddlewares.verifyTrainer,
  controller.findOutstandingMemberships
);

/**
 * @swagger
 * /api/memberships/{id}:
 *   get:
 *     summary: Obtener una membresía
 *     operationId: getMembershipById
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Membresía encontrada exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/memberships/:
 *   get:
 *     summary: Obtener todas las membresías
 *     operationId: getAllMemberships
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Lista de membresías obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/memberships/:
 *   post:
 *     summary: Crear una nueva membresía
 *     operationId: createMembership
 *     tags:
 *       - Membresías
 *     responses:
 *       201:
 *         description: Membresía creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembership,
  controller.add
);

/**
 * @swagger
 * /api/memberships/{id}:
 *   put:
 *     summary: Actualizar una membresía
 *     operationId: updateMembershipById
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Membresía actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembership,
  controller.update
);

/**
 * @swagger
 * /api/memberships/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una membresía
 *     operationId: patchMembershipById
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Membresía actualizada parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Membresía no encontrada
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeMembership,
  controller.update
);

/**
 * @swagger
 * /api/memberships/{id}:
 *   delete:
 *     summary: Eliminar una membresía
 *     operationId: deleteMembershipById
 *     tags:
 *       - Membresías
 *     responses:
 *       200:
 *         description: Membresía eliminada exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
membershipRouter.delete(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.delete
);
