const joi = require('joi');
const envSchema = joi.object({
    DB_CONNECTION : joi.string(),
    PORT: joi.number().positive().default(3000),
})
.unknown();
module.exports = envSchema;