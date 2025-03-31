import { DriverException, NotFoundError } from "@mikro-orm/core";
import { ApiResponse } from "../classes/api-response.class.js";
import { HttpError } from "./http-error.js";
import { Response } from "express";

export function handleError(error: unknown, res: Response) {
  if (error instanceof HttpError) return error.send(res);

  if (error instanceof DriverException) {
    return res.status(500).json(new ApiResponse(error.message, null, false));
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      message: "No se pudo encontrar una de las entidades.",
    });
  }

  return res
    .status(500)
    .json(new ApiResponse((error as Error).message, null, false));
}
