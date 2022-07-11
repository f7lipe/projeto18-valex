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

router.post(
    "/cards/:id/activate", 
    validationMiddleware.validateCardActivation,
    cardController.activateCard
    )

export default router