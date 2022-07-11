import { NextFunction, Request, Response } from "express";

export default function validateApiKey(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) return res.sendStatus(401);
    res.locals.apiKey = apiKey
    next()
}