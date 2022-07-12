import "../config/setupEnv.js"

import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyService from "../services/companySerivice.js"
import * as employeeService from "../services/employeeService.js"
import * as paymentService from "../services/paymentService.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

const cryptr = new Cryptr(process.env.CRYPTO_SECRET);

/// CARD CREATION
export async function createCard(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
  await companyService.validateApiKey(apiKey)

  const employee = await employeeService.getEmplpyeeById(employeeId)

  await isExistingCard(employeeId, type)

  const cardData = generateCardData(employee.fullName)
  const unecrypedCardData = { ...cardData, employeeId, type }
  cardData.securityCode = cryptr.encrypt(cardData.securityCode);

  await cardRepository.insert(
    {
      ...cardData,
      employeeId,
      isVirtual: false,
      isBlocked: false,
      type,
    }
  );
  return {unecrypedCardData}
}

async function isExistingCard(employeeId: number, type: cardRepository.TransactionTypes) {
  const existingCard = await cardRepository.findByTypeAndEmployeeId(type, employeeId)
  if (existingCard) throw {
    statusCode: 409,
    type: "conflict",
    message: "Card already exists"
  }

}

function generateCardData(employeeName: string) {
  const number = faker.finance.creditCardNumber("mastercard");
  const cardholderName = formatCardholderName(employeeName);
  const expirationDate = dayjs().add(5, "year").format("MM/YY");

  return {
    number,
    cardholderName,
    securityCode: generateSecurityCode(),
    expirationDate,
  };
}

function formatCardholderName(fullName: string) {
  const [firstName, ...nickNames] = fullName.split(" ")
  const lastName = nickNames.pop();
  const middleNames = nickNames.map((nickName) => getFirsNameLetter(nickName))

  if (middleNames.length > 0) {
    const formmatedName = `${firstName} ${middleNames.join(" ")} ${lastName}`
    return formmatedName.toUpperCase();
  }

  return [firstName, lastName].join(" ").toUpperCase();
}

function getFirsNameLetter(middleName: string) {
  return middleName[0];
}

function generateSecurityCode() {
  const securityCode = faker.finance.creditCardCVV();
  return securityCode
}

/// CARD ACTIVATION
export async function activateCard(cardId: number, cvc: string, password: string) {
  const card = await getCardById(cardId);

  validateExpirationDate(card.expirationDate);

  const isAlreadyActive = card.password;
  if (isAlreadyActive) throw {
    statusCode: 409,
    type: "conflict",
    message: "Card already active"
  }

  validateCVC(cvc, cryptr.decrypt(card.securityCode));
  
  const passwordFormat = /^SW[0-9]{4}$/; // 4 digits
  if ((passwordFormat.test(password))) throw {
    statusCode: 400,
    type: "bad_request",
    message: "Password must be 4 digits"
  };


  const hashedPassword = bcrypt.hashSync(password, 12);
  await cardRepository.update(cardId, { password: hashedPassword });
}

export async function getCardById(id: number) {
  const card = await cardRepository.findById(id);
  if (!card) throw {
    statusCode: 404,
    type: "not_found",
    message: "Card not found"
  };

  return card;
}

export function validateExpirationDate(expirationDate: string) {
  const today = dayjs().format("MM/YY");
  if (dayjs(today).isAfter(dayjs(expirationDate))) {
    throw {
      statusCode: 400,
      type: "bad_request",
      message: "Card expired"
    }
  }
}

export function validateCVC(cvc: string, cardCVC: string) {
  const isCVCValid = cvc === cardCVC
  if (!isCVCValid) throw {
    statusCode: 400,
    type: "bad_request",
    message: "CVC is invalid"
  }
}

/// CARD BLOCKING
export async function lockManager(cardId: number, password: string) {
  const card = await getCardById(cardId);
  validateExpirationDate(card.expirationDate);
  validatePassword(password, card.password);
  await cardRepository.update(cardId, { isBlocked: !card.isBlocked });
  return { isBlocked: !card.isBlocked }
}

export function validatePassword(password: string, cardPassword: string) {
  const isPasswordValid = bcrypt.compareSync(password, cardPassword);
  if (!isPasswordValid) throw {
    statusCode: 400,
    type: "bad_request",
  };

}

/// CARD BALANCE  
export async function getBalance(cardId: number) {
  const card = await getCardById(cardId);
  const payments = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  const cardAmount = paymentService.getCardAmount(payments, recharges);
  return {
    cardAmount,
    recharges,
    payments,
  }
}

/// CARD RECHARGE
export async function recharge(apiKey:string ,cardId: number, amount: number) {
await companyService.validateApiKey(apiKey)
const card = await getCardById(cardId);
const isAlreadyActive = card.password;
if (!isAlreadyActive) throw {
  statusCode: 409,
  type: "conflict",
  message: "Card not active"
}
validateExpirationDate(card.expirationDate);
if (amount <= 0 || !amount) throw {
    statusCode: 400,
    type: "bad_request",
    message: "Amount must be greater than 0"
  }
const recharge = await rechargeRepository.insert({
    cardId,
    amount,
  });
  return recharge;
}
