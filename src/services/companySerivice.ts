import * as companyRepository from "../repositories/companyRepository.js"

export async function validateApiKey(apiKey: string) {
    const company = await companyRepository.findByApiKey(apiKey);
    if (!company) throw { 
        statusCode: 401,
        type: "not_found",
        message: "Company not found"
     };
  }

