const Joi = require('joi');
const loginSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const refreshTokenSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
module.exports = {
  loginSchema,
  refreshTokenSchema,
};
