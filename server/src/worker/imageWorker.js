const { parentPort, workerData } = require('worker_threads');
const AWS = require('../config/awsConfig');
const sharp = require('sharp');
const fs = require('fs');
const config = require('../config/config');

async function processImage(imagePath, imageKey) {
    try {
        const s3 = new AWS.S3();
        const resizedImage = await sharp(imagePath).resize(800, 600).toBuffer();

        const putParams = {
            Bucket: config.aws.bucketName,
            Key: imageKey,
            Body: resizedImage,
            ContentType: 'image/jpeg',
        };
        await s3.putObject(putParams).promise();
        fs.unlinkSync(imagePath); // Delete the local file after upload
        parentPort.postMessage(`Image processed and saved as ${putParams.Key}`);
    } catch (error) {
        parentPort.postMessage(`Error processing image: ${error.message}`);
    }
}

processImage(workerData.imagePath, workerData.imageKey);
