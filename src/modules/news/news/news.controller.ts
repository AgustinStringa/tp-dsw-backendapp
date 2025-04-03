import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../../utils/classes/api-response.class.js";
import { handleError } from "../../../utils/errors/error-handler.js";
import { News } from "./news.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateDateTime } from "../../../utils/validators/data-type.validators.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

export const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const news = await em.find(News, {});
      res
        .status(200)
        .json(new ApiResponse("Todas las noticias fueron encontradas", news));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const news = await em.findOneOrFail(News, id);
      res.status(200).json(new ApiResponse("Noticia encontrada", news));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const news = em.create(News, req.body.sanitizedInput);
      validateEntity(news);

      await em.flush();
      res.status(200).json(new ApiResponse("Noticia Creada", news));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const news = await em.findOneOrFail(News, req.params.id);
      em.assign(news, req.body.sanitizedInput);
      news.checkExpirationDate();

      validateEntity(news);
      await em.flush();

      res.status(200).json(new ApiResponse("Noticia Actualizada", news));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const news = em.getReference(News, id);
      await em.removeAndFlush(news);
      res.status(200).json(new ApiResponse("Noticia Eliminada", news));
    } catch (error: unknown) {
      handleError(error, res);
    }
  },

  sanitizeNews: function (req: Request, res: Response, next: NextFunction) {
    const allowUndefined = req.method === "PATCH";
    req.body.sanitizedInput = {
      expirationDateTime: validateDateTime(
        req.body.expirationDateTime,
        "expirationDateTime",
        allowUndefined
      ),
      title: req.body.title?.trim(),
      body: req.body.body?.trim(),
    };

    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined)
        delete req.body.sanitizedInput[key];
    });

    next();
  },
};
