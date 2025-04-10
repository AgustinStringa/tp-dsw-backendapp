import { controller } from "./auth.controller.js";
import { Router } from "express";

export const authRouter = Router();

/**
 * @swagger
 * /api/auth/:
 *   post:
 *     summary: Loguearse en el sistema
 *     operationId: login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                  type: string
 *                  example: admin
 *              password:
 *                  type: string
 *                  example: mypassword
 *            required:
 *              - email
 *              - password
 *     security: []
 *     responses:
 *       200:
 *         description: Sesión iniciada
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: auth_token=abcde12345; Path=/; HttpOnly
 *       401:
 *         description: No autenticado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
authRouter.post("/", controller.sanitizeLogin, controller.login);
authRouter.post("/logout/", controller.logout);
authRouter.post("/refresh/", controller.refresh);
