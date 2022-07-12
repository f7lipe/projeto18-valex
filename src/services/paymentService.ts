import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessService from "../services/businessService.js";
import * as cardService from "../services/cardServices.js";
import { sumTransactions } from "./transactionService.js";

export async function pay(
  id: number,
  password: string,
  businessId: number,
  amount: number
) {
  console.log(amount, businessId, password, id);
  const card = await cardService.getCardById(id);
  cardService.validateExpirationDate(card.expirationDate);

  const isAlreadyActive = card.password;
  if (!isAlreadyActive) throw {
    statusCode: 409,
    type: "conflict",
    message: "Card not active"
  }

  const isBlocked = card.isBlocked
  if (isBlocked) throw {
    statusCode: 409,
    type: "conflict",
    message: "Card is blocked"
  }

  cardService.validatePassword(password, card.password);

  const business = await businessService.getBusinessById(id);

  if (card.type !== business.type) throw { 
    statusCode: 400,
    type: "bad_request", 
    message: "Card type does not match business type"
  };
  
  const payments = await paymentRepository.findByCardId(id);
  const recharges = await rechargeRepository.findByCardId(id);

  const cardAmount = getCardAmount(payments, recharges);
  if (cardAmount < amount) throw {
    statusCode: 400,
    type: "bad_request",
    message: "Card amount is not enough"
   }
  

  await paymentRepository.insert({ cardId: id, businessId, amount });
}

export function getCardAmount(
  payments: paymentRepository.PaymentWithBusinessName[],
  recharges: rechargeRepository.Recharge[]
) {
  const totalPaymentAmount = payments.reduce(sumTransactions, 0);
  const totalRechargeAmount = recharges.reduce(sumTransactions, 0);
  return totalRechargeAmount - totalPaymentAmount;
}
