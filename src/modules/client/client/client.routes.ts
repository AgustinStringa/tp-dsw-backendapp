import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./client.controller.js";
import { Router } from "express";

export const clientRouter = Router();

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Obtener un cliente
 *     operationId: getClientById
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Cliente encontrado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error en el servidor
 */
clientRouter.get("/:id", authMiddlewares.verifyTrainer, controller.findOne);

/**
 * @swagger
 * /api/clients/:
 *   get:
 *     summary: Obtener todos los clientes
 *     operationId: getAllClients
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
clientRouter.get("/", authMiddlewares.verifyTrainer, controller.findAll);

/**
 * @swagger
 * /api/clients/:
 *   post:
 *     summary: Crear un nuevo cliente (permite registro por parte del cliente)
 *     operationId: createClient
 *     tags:
 *       - Clientes
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El email y/o el DNI ingresados pertenecen a otro usuario
 *       500:
 *         description: Error en el servidor
 */
clientRouter.post("/", controller.sanitizeClient, controller.add); //un visitante se puede registrar

/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     operationId: updateClientById
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente no encontrado
 *       409:
 *         description: El email y/o el DNI ingresados pertenecen a otro usuario
 *       500:
 *         description: Error en el servidor
 */
clientRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClient,
  controller.update
);

/**
 * @swagger
 * /api/clients/self-update/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un cliente (autoupdate)
 *     operationId: patchClientSelfUpdate
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Cliente actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente no encontrado
 *       409:
 *         description: El email y/o el DNI ingresados pertenecen a otro usuario
 *       500:
 *         description: Error en el servidor
 */
clientRouter.patch(
  "/self-update/:id",
  authMiddlewares.verifyClient,
  controller.sanitizeSelfUpdate,
  controller.update
);

/**
 * @swagger
 * /api/clients/{id}:
 *   patch:
 *     summary: Actualizar parcialmente un cliente
 *     operationId: patchClientById
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Cliente actualizado parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Cliente no encontrado
 *       409:
 *         description: El email y/o el DNI ingresados pertenecen a otro usuario
 *       500:
 *         description: Error en el servidor
 */
clientRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeClient,
  controller.update
);

/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     operationId: deleteClientById
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
clientRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
