const Joi = require("joi");
const { password } = require("./custom.validation");

const createEmployeeSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.custom(password).required(),
  }),
};

module.exports = {
  createEmployeeSchema,
};
