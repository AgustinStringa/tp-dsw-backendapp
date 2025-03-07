import { Request, Response, NextFunction } from "express";
import { News } from "./news.entity.js";
import { orm } from "../../../config/db/mikro-orm.config.js";
import { validateEntity } from "../../../utils/validators/entity.validators.js";

const em = orm.em;

const controller = {
  findAll: async function (req: Request, res: Response) {
    try {
      const news = await em.find(News, {});
      res.status(200).json({ message: "All news were found", data: news });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  findOne: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const news = await em.findOneOrFail(News, id);
      res.status(200).json({ message: "News found", data: news });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  add: async function (req: Request, res: Response) {
    try {
      const news = em.create(News, req.body.sanitizedInput);
      validateEntity(news);

      await em.flush();
      res.status(200).json({ message: "News created", data: news });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      const news = await em.findOneOrFail(News, req.params.id);
      em.assign(news, req.body.sanitizedInput);
      news.checkExpirationDate();

      validateEntity(news);
      await em.flush();

      res.status(200).json({ message: "News updated", data: news });
    } catch (error: any) {
      let errorCode = 500;
      if (error.message.match("not found")) errorCode = 404;
      res.status(errorCode).json({ message: error.message });
    }
  },

  delete: async function (req: Request, res: Response) {
    try {
      const id = req.params.id;
      const news = em.getReference(News, id);
      await em.removeAndFlush(news);
      res.status(200).json({ message: "News deleted", data: news });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  sanitizeNews: function (req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
      expirationDateTime: req.body.expirationDateTime,
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

export { controller };
