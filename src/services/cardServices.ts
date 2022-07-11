import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import cryptr from "cryptr";

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyService from "../services/companySerivice.js"
import * as employeeService from "../services/employeeService.js"
import Cryptr from "cryptr";

export async function createCard(apiKey: string, employeeId: number, type: cardRepository.TransactionTypes) {
    await companyService.validateApiKey(apiKey)

    const employee = await employeeService.getById(employeeId)

    await isExistingCard(employeeId, type)

    const cardData = generateCardData(employee.fullName)

    await cardRepository.insert(
        {
            ...cardData,
            employeeId,
            isVirtual: false,
            isBlocked: false,
            type,
        }
    );
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

    const hashedSecurityCode = generateSecurityCode();

    return {
        number,
        cardholderName,
        securityCode: hashedSecurityCode,
        expirationDate,
    };
}

function generateSecurityCode() {
    const securityCode = faker.finance.creditCardCVV();
    const cryptr = new Cryptr('myTotallySecretKey');
    return cryptr.encrypt(securityCode);
}

function formatCardholderName(fullName: string) {
    const [firstName, ...nickNames] = fullName.split(" ")
    const lastName = nickNames.pop();
    const middleNames = nickNames.map((nickName)=> getFirsNameLetter(nickName))
    
    if (middleNames.length > 0) {
        const formmatedName = `${firstName} ${middleNames.join(" ")} ${lastName}`
        return formmatedName.toUpperCase();
    }

    return [firstName, lastName].join(" ").toUpperCase();
}

function getFirsNameLetter(middleName: string) {
    return middleName[0];
}
