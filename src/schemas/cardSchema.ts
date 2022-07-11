import Joi from "joi";

export const createCardSchema = Joi.object({
  employeeId: Joi.number().required(),
  type: Joi.string()
    .valid("groceries", "restaurants", "transport", "education", "health")
    .required(),
});




export const activateCardSchema = Joi.object({
  cvc: Joi.string().required(),
  password: Joi.string().required(),
});


