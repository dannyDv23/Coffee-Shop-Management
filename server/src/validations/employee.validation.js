const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createEmployeeSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    username: Joi.string().required(),
    password: Joi.custom(password).required(),
    retypePassword: Joi.custom(password).required(),
    position: Joi.string().required(),
    salary: Joi.number().required(),
    address: Joi.string().trim(),
    phoneNumber: Joi.string()
      .pattern(/^0[3-9]\d{8}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must start with 0 and have 10 digits.",
      }),
  }),
};

const updateEmployeeSchema = {
  body: Joi.object().keys({
    name: Joi.string().trim(),
    password: Joi.custom(password),
    retypePassword: Joi.custom(password),
    position: Joi.string(),
    salary: Joi.number().min(0),
    address: Joi.string().trim(),
    phoneNumber: Joi.string()
      .pattern(/^0[3-9]\d{8}$/)
      .messages({
        "string.pattern.base":
          "Phone number must start with 0 and have 10 digits.",
      }),
  }),
};

const deleteEmployeeSchema = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  }),
};
module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  deleteEmployeeSchema,
};
