import { Router } from "express";
import * as cardController from "../controllers/cardController.js";
import  validateApiKey  from "../middlewares/requestValidationsMiddleware.js";
import * as validationMiddleware from "../middlewares/validateCardMiddleware.js";

const router = Router()

router.post(
    "/cards", 
    validateApiKey,
    validationMiddleware.validateCardCreation, 
    cardController.createCard
    )

router.put(
    "/cards/:cardId/activate", 
    validationMiddleware.validateCardActivation,
    cardController.activateCard
    )

router.get(
    "/balance/:cardId",
    cardController.getBalance
)

router.post(
    "/locker/:cardId",
    cardController.locker
)


export default router