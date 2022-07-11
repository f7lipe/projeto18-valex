import { NextFunction, Request, Response } from "express";
import * as cardSchema from "../schemas/cardSchema.js";

export function validateCardCreation(req: Request, res: Response, next: NextFunction) {
  const { body } = req;
  const { error } = cardSchema.createCardSchema.validate(body);
  if (error) {
    return res.status(400).send({ error: error.message });
  }
  next();
}

export function validateCardActivation(req: Request, res: Response, next: NextFunction) {
  const { body } = req;
  const { error } = cardSchema.activateCardSchema.validate(body);
  if (error) {
    return res.status(400).send({ error: error.message });
  }
  next();
}