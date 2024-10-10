require("dotenv").config();
const { envValidation } = require("../validations");
const { value: envVars, error } = envValidation.validate(process.env);
const logger = require("./logger");
if (error) {
  logger.error(error);
}

module.exports = {
  port: envVars.PORT,
  dbConnection: envVars.DB_CONNECTION,
  env: envVars.NODE_ENV,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  rootRoute: envVars.ROOT_ROUTE,
  whiteList: envVars.WHITE_LIST,
  aws: {
    id: envVars.AWS_ACCESS_KEY_ID,
    secret: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
    bucketName: envVars.AWS_BUCKET_NAME,
  },
};
