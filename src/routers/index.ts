import { Router } from "express";
import * as cardController from "../controllers/cardController.js";
import  validateApiKey  from "../middlewares/requestValidationsMiddleware.js";
import * as validationMiddleware from "../middlewares/validateCardMiddleware.js";
import { validateSchema } from "../middlewares/validation.js";
import { purchaseSchema } from "../schemas/cardSchema.js";

const router = Router()

router.post(
    "/cards", 
    validateApiKey,
    validationMiddleware.validateCardCreation, 
    cardController.createCard
    )

router.put(
    "/cards/:cardId", 
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

router.post(
    "/recharge/:cardId",
    validateApiKey,
    cardController.recharge
)

router.post(
    "/purchase",
    validateSchema(purchaseSchema),
    cardController.purchase
)
export default router