import { NextFunction, Request, Response } from "express";
import createCardSchema from "../schemas/cardSchema.js";

export default function validateCardCreation(req: Request, res: Response, next: NextFunction) {
  const { body } = req;
  const { error } = createCardSchema.validate(body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
}