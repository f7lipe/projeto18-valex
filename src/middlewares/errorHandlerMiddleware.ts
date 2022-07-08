import { Request, Response, NextFunction } from "express";

 export default function handleErrors(
    err,
    req: Request,
    res: Response,
    next: NextFunction) {
    if(err) res.status(err.statusCode).send(err.message)
}