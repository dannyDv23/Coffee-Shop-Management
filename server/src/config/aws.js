const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../config/config");

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.secret,
  },
});

module.exports = s3;
