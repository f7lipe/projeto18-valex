import { Request, Response } from "express";
import * as cardService from "../services/cardServices.js"

export async function createCard(req: Request, res: Response) {
    const apiKey = res.locals.apiKey
    const { employeeId, type } = req.body;
    await cardService.createCard(apiKey, employeeId, type);
    res.sendStatus(201);
}