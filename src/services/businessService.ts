import * as businessRepository from "../repositories/businessRepository.js";

export async function getBusinessById(id: number) {
  const business = await businessRepository.findById(id);
  if (!business) {
    throw { 
      statusCode: 404,
      type: "not_found",
      message: "Business not found"
     };
  }

  return business;
}
