import { Request, Response } from "express";
import * as cardService from "../services/cardServices.js"
import * as paymentService from "../services/paymentService.js"

export async function createCard(req: Request, res: Response) {
    const apiKey = res.locals.apiKey
    const { employeeId, type } = req.body;
    await cardService.createCard(apiKey, employeeId, type);
    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const { cardId } = req.params;
    const { cvc, password } = req.body;
    await cardService.activateCard(Number(cardId), cvc, password);
    res.sendStatus(200);
}

export async function getBalance(req: Request, res: Response) {
    const { cardId } = req.params;
    const balance = await cardService.getBalance(Number(cardId));
    res.send(balance);
}

export async function locker(req: Request, res: Response){
    const { cardId } = req.params;
    const {password} = req.body;

    await cardService.lockManager(Number(cardId), password);
    res.sendStatus(200);
}

export async function recharge(req: Request, res: Response){
    const { cardId } = req.params;
    const {amount} = req.body;

    await cardService.recharge(Number(cardId), amount);
    res.sendStatus(200);
}

export async function purchase(req: Request, res: Response){
    const { cardId } = req.params;
    const {amount, businessId, password} = req.body;

    await paymentService.pay(Number(cardId), password, businessId, amount);
    res.sendStatus(200);
}