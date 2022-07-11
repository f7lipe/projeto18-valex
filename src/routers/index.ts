import { Router } from "express";
import * as cardController from "../controllers/cardController.js";
import  validateApiKey  from "../middlewares/requestValidationsMiddleware.js";
import validateCardCreation from "../middlewares/validateCardCreationMiddleware.js";

const router = Router()

router.post(
    "/cards", 
    validateApiKey,
    validateCardCreation, 
    cardController.createCard
    )


export default router