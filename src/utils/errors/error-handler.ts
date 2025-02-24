import { DriverException, NotFoundError } from "@mikro-orm/core";
import { Response } from "express";
import { HttpError } from "./http-error.js";

export function handleError(error: any, res: Response) {
  if (error instanceof HttpError) return error.send(res);

  if (error instanceof DriverException) {
    return res.status(500).json({
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      message: "No se pudo encontrar una de las entidades.",
    });
  }

  return res.status(500).json({ message: error.message });
}
