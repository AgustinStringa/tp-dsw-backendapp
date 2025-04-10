import { authMiddlewares } from "../../auth/auth/auth.middlewares.js";
import { controller } from "./news.controller.js";
import { Router } from "express";

export const newsRouter = Router();

/**
 * @swagger
 * /api/news/:
 *   get:
 *     summary: Obtener todas las noticias
 *     operationId: getAllNews
 *     tags:
 *       - Noticias
 *     responses:
 *       200:
 *         description: Lista de noticias obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */
newsRouter.get("/", controller.findAll);

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Obtener una noticia
 *     operationId: getNewsById
 *     tags:
 *       - Noticias
 *     responses:
 *       200:
 *         description: Noticia encontrada exitosamente
 *       400:
 *         description: Id inválido
 *       404:
 *         description: Noticia no encontrada
 *       500:
 *         description: Error en el servidor
 */
newsRouter.get("/:id", controller.findOne);

/**
 * @swagger
 * /api/news/:
 *   post:
 *     summary: Crear una nueva noticia
 *     operationId: createNews
 *     tags:
 *       - Noticias
 *     responses:
 *       201:
 *         description: Noticia creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
newsRouter.post(
  "/",
  authMiddlewares.verifyTrainer,
  controller.sanitizeNews,
  controller.add
);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Actualizar una noticia
 *     operationId: updateNewsById
 *     tags:
 *       - Noticias
 *     responses:
 *       200:
 *         description: Noticia actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Noticia no encontrada
 *       500:
 *         description: Error en el servidor
 */
newsRouter.put(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeNews,
  controller.update
);

/**
 * @swagger
 * /api/news/{id}:
 *   patch:
 *     summary: Actualizar parcialmente una noticia
 *     operationId: patchNewsById
 *     tags:
 *       - Noticias
 *     responses:
 *       200:
 *         description: Noticia actualizada parcialmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Noticia no encontrada
 *       500:
 *         description: Error en el servidor
 */
newsRouter.patch(
  "/:id",
  authMiddlewares.verifyTrainer,
  controller.sanitizeNews,
  controller.update
);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Eliminar una noticia
 *     operationId: deleteNewsById
 *     tags:
 *       - Noticias
 *     responses:
 *       200:
 *         description: Noticia eliminada exitosamente
 *       400:
 *         description: Id inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error en el servidor
 */
newsRouter.delete("/:id", authMiddlewares.verifyTrainer, controller.delete);
