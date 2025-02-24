import { Response } from "express";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }

  send(res: Response) {
    res.status(this.statusCode).json({ message: this.message });
  }
}
