const AWS = require('aws-sdk');
const config = require('../config/config');

AWS.config.update({
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.secret,
    region: config.aws.region,
});

module.exports = AWS;
