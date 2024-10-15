const {parentPort, workerData} = require("worker_threads");
const sharp = require("sharp");
const fs = require("fs");
const config = require("../config/config");
const s3 = require("../config/aws");
const {PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");

async function processImage(imageKey, currentImageKey, imagePath) {
    try {
        // Delete the current image if it exists
        if (currentImageKey) {
            const deleteParams = {
                Bucket: config.aws.bucketName,
                Key: currentImageKey,
            };
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3.send(deleteCommand);
            console.log(`Image deleted successfully: ${currentImageKey}`);
        }

        const resizedImage = await sharp(imagePath).resize(800, 600).toBuffer();

        const putParams = {
            Bucket: config.aws.bucketName,
            Key: imageKey,
            Body: resizedImage,
            ContentType: "image/jpeg",
        };

        const putCommand = new PutObjectCommand(putParams);
        await s3.send(putCommand);

        // Generate a signed URL for the uploaded image
        const getParams = {
            Bucket: config.aws.bucketName,
            Key: imageKey,
        };
        const getCommand = new GetObjectCommand(getParams);
        const imageUrl = await getSignedUrl(s3, getCommand);

        // Delete the local file after successful upload
        setTimeout(() => {
            fs.access(imagePath, fs.constants.F_OK, (accessErr) => {
                if (accessErr) {
                    console.error(`File not found: ${imagePath}`);
                } else {
                    fs.unlinkSync(imagePath,
                        {force: true},
                        (err) => {
                            if (err) {
                                console.error(`Error deleting file: ${err.message}`);
                            } else {
                                console.log(`File deleted successfully: ${imagePath}`);
                            }
                        });
                }
            });
        }, 2000);

        parentPort.postMessage(imageUrl);
    } catch (error) {
        parentPort.postMessage({message: `Error processing image: ${error.message}`});
    }
}

processImage(workerData.imagePath, workerData.imageKey, workerData.currentImageKey);
