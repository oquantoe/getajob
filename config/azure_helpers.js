var { StorageSharedKeyCredential, BlobServiceClient } = require('@azure/storage-blob');
var { AbortController } = require('@azure/abort-controller');
var fs = require("fs");
var path = require("path");
var azure = require('azure-storage');
var appRoot = require('app-root-path');
var logger = require('./log4js');
var config = require('./config');
var mailer = require('./mail/mailer');

class AzureHelper {

    async uploadResumeToAzure(files) {
        try {
            var fileName = config.docs_sub_container + config.resumes_folder + files.resume.name;
            var filePath = files.resume.path;

            var credentials = new StorageSharedKeyCredential(config.azure_storage_account_name, config.azure_storage_access_key);

            var blobServiceClient = new BlobServiceClient(`https://${config.azure_storage_account_name}.blob.core.windows.net`, credentials);

            var containerClient = blobServiceClient.getContainerClient(config.azure_storage_container_name);
            // var blobClient = containerClient.getBlobClient(fileName);
            // var blockBlobClient = blobClient.getBlockBlobClient();

            var aborter = AbortController.timeout(30 * config.one_minute);

            //await containerClient.create();
            //console.log(`Container: "${containerName}" is created`);

            //console.log("Containers:");
            //await this.showContainerNames(aborter, blobServiceClient);

            //await blockBlobClient.upload(content, content.length, aborter);
            //console.log(`Blob "${blobName}" is uploaded`);

            //await uploadLocalFile(aborter, containerClient, localFilePath);
            //console.log(`Local file "${localFilePath}" is uploaded`);

            await this.uploadStream(aborter, containerClient, fileName, filePath);
            console.log(`Local file "${filePath}" is uploaded as a stream`);

            //console.log(`Blobs in "${config.azure_storage_container}" container:`);

            //await this.showBlobNames(aborter, containerClient);

            // var downloadResponse = await blockBlobClient.download(0,aborter);
            // var downloadedContent = await streamToString(downloadResponse.readableStreamBody);

            // console.log(`Downloaded blob content: "${downloadedContent}"`);

            //await blockBlobClient.delete(aborter);
            //console.log(`Block blob "${blobName}" is deleted`);

            //await containerClient.delete(aborter);
            //console.log(`Container "${containerName}" is deleted`);
        } catch (error) {
            logger.log(error);
        }

    }

    async uploadAdditionalFilesToAzure(files) {
        try {
            var fileName = config.docs_sub_container + config.additional_files_folder + files.additional_file.name;
            var filePath = files.additional_file.path;

            var credentials = new StorageSharedKeyCredential(config.azure_storage_account_name, config.azure_storage_access_key);

            var blobServiceClient = new BlobServiceClient(`https://${config.azure_storage_account_name}.blob.core.windows.net`, credentials);

            var containerClient = blobServiceClient.getContainerClient(config.azure_storage_container_name);

            var aborter = AbortController.timeout(30 * config.one_minute);

            await this.uploadStream(aborter, containerClient, fileName, filePath);
            console.log(`Local file "${filePath}" is uploaded as a stream`);
        } catch (error) {
            logger.log(error);
        }
    }

    async uploadProfilePictureToAzure(files) {
        try {
            var fileName = config.images_sub_container + config.profile_pictures_folder + files.profile_picture.name;
            var filePath = files.profile_picture.path;

            var credentials = new StorageSharedKeyCredential(config.azure_storage_account_name, config.azure_storage_access_key);

            var blobServiceClient = new BlobServiceClient(`https://${config.azure_storage_account_name}.blob.core.windows.net`, credentials);

            var containerClient = blobServiceClient.getContainerClient(config.azure_storage_container_name);

            var aborter = AbortController.timeout(30 * config.one_minute);

            await this.uploadStream(aborter, containerClient, fileName, filePath);
            console.log(`Local file "${filePath}" is uploaded as a stream`);
        } catch (error) {
            logger.log(error);
        }

    }

    async uploadRecruiterKYCDocsToAzure(files) {
        try {
            var meansOfIDFileName = config.docs_sub_container + config.recruiter_kyc_folder + files.means_of_identification.name;
            var meansOfIDFilePath = files.means_of_identification.path;

            var certOfIncorporationFileName = config.docs_sub_container + config.recruiter_kyc_folder + files.cert_of_incorporation.name;
            var certOfIncorporationFilePath = files.cert_of_incorporation.path;

            var credentials = new StorageSharedKeyCredential(config.azure_storage_account_name, config.azure_storage_access_key);

            var blobServiceClient = new BlobServiceClient(`https://${config.azure_storage_account_name}.blob.core.windows.net`, credentials);

            var containerClient = blobServiceClient.getContainerClient(config.azure_storage_container_name);

            var aborter = AbortController.timeout(30 * config.one_minute);

            await this.uploadStream(aborter, containerClient, meansOfIDFileName, meansOfIDFilePath);
            console.log(`Local meansOfIDFilePath file "${meansOfIDFilePath}" is uploaded as a stream`);

            await this.uploadStream(aborter, containerClient, certOfIncorporationFileName, certOfIncorporationFilePath);
            console.log(`Local certOfIncorporationFilePath file "${certOfIncorporationFilePath}" is uploaded as a stream`);
        } catch (error) {
            logger.log(error);
        }

    }

    async uploadCompanyLogoToAzure(files) {
        try {
            var fileName = config.images_sub_container + config.company_logos_folder + files.company_logo.name;
            var filePath = files.company_logo.path;

            var credentials = new StorageSharedKeyCredential(config.azure_storage_account_name, config.azure_storage_access_key);

            var blobServiceClient = new BlobServiceClient(`https://${config.azure_storage_account_name}.blob.core.windows.net`, credentials);

            var containerClient = blobServiceClient.getContainerClient(config.azure_storage_container_name);

            var aborter = AbortController.timeout(30 * config.one_minute);

            await this.uploadStream(aborter, containerClient, fileName, filePath);
            console.log(`Local file "${filePath}" is uploaded as a stream`);
        } catch (error) {
            logger.log(error);
        }
    }

    async uploadLocalFile(aborter, containerClient, filePath) {
        try {
            filePath = path.resolve(filePath);

            var fileName = path.basename(filePath);

            var blobClient = containerClient.getBlobClient(fileName);
            var blockBlobClient = blobClient.getBlockBlobClient();

            return await blockBlobClient.uploadFile(filePath, aborter);
        } catch (error) {
            logger.log(error);
        }
    }

    async uploadStream(aborter, containerClient, fileName, filePath) {
        try {
            filePath = path.resolve(filePath);

            var blobClient = containerClient.getBlobClient(fileName);
            var blockBlobClient = blobClient.getBlockBlobClient();

            var stream = fs.createReadStream(filePath, {
                highWaterMark: config.four_megabytes,
            });

            var uploadOptions = {
                bufferSize: config.four_megabytes,
                maxBuffers: 5,
            };

            return await blockBlobClient.uploadStream(
                stream,
                uploadOptions.bufferSize,
                uploadOptions.maxBuffers,
                aborter);
        } catch (error) {
            logger.log(error);
        }
    }

    // [Node.js only] A helper method used to read a Node.js readable stream into string
    async streamToString(readableStream) {
        try {
            return new Promise((resolve, reject) => {
                var chunks = [];
                readableStream.on("data", (data) => {
                    chunks.push(data.toString());
                });
                readableStream.on("end", () => {
                    resolve(chunks.join(""));
                });
                readableStream.on("error", reject);
            });
        } catch (error) {
            logger.log(error);
        }
    }

    async downloadFromBlob(res, fileName) {
        try {
            var blobService = azure.createBlobService(config.azure_storage_connection_string);
            var fileNameInContainer = "docs/resumes/" + fileName;

            var destinationFilePath = `${appRoot}/assets/temp/${fileName}`;

            return new Promise((resolve, reject) => {
                blobService.getBlobToLocalFile(config.azure_storage_container_name, fileNameInContainer,
                    destinationFilePath, (error, downloadedBlob) => {

                        if (!error) {
                            logger.log(`File downloaded successfully. ${destinationFilePath}`);

                            resolve(downloadedBlob);

                            this.handlePostBlobDownload(res, downloadedBlob, destinationFilePath);
                        } else {
                            logger.log(`An error occured while downloading a file. ${error}`);
                            reject(error);
                        }
                    });
            });
        } catch (error) {
            logger.log(error);
        }
    }

    async downloadRecruiterKYCDocFromBlob(res, fileName) {
        try {
            var blobService = azure.createBlobService(config.azure_storage_connection_string);
            var fileNameInContainer = "docs/recruiter_kyc/" + fileName;

            var destinationFilePath = `${appRoot}/assets/temp/${fileName}`;

            return new Promise((resolve, reject) => {
                blobService.getBlobToLocalFile(config.azure_storage_container_name, fileNameInContainer,
                    destinationFilePath, (error, downloadedBlob) => {

                        if (!error) {
                            logger.log(`File downloaded successfully. ${destinationFilePath}`);

                            resolve(downloadedBlob);

                            this.handlePostBlobDownload(res, downloadedBlob, destinationFilePath);
                        } else {
                            logger.log(`An error occured while downloading a file. ${error}`);
                            reject(error);
                        }
                    });
            });
        } catch (error) {
            logger.log(error);
        }
    }

    async downloadCVAndSendMailsForReview(res, candidate, fileName, transaction, reviewer) {
        try {
            var blobService = azure.createBlobService(config.azure_storage_connection_string);
            var fileNameInContainer = "docs/resumes/" + fileName;

            var destinationFilePath = `${appRoot}/assets/temp/${fileName}`;

            return new Promise((resolve, reject) => {
                blobService.getBlobToLocalFile(config.azure_storage_container_name, fileNameInContainer,
                    destinationFilePath, (error, downloadedBlob) => {

                        if (!error) {
                            logger.log(`File downloaded successfully. ${destinationFilePath}`);

                            resolve(downloadedBlob);

                            var reviewer_name = 'GetaJobNG Team';
                            var reviewer_email = 'cvfixrequests@c-ileasing.com';

                            //send mail
                            mailer.sendCVReviewConfirmationMailToCandidate(candidate, transaction);
                            mailer.sendCVToReviewer(reviewer_name, reviewer_email, candidate, transaction,
                                fileName, destinationFilePath);


                            res.redirect('/candidates/cv-payment-notification');
                        } else {
                            logger.log(`An error occured while downloading a file. ${error}`);
                            reject(downloadedBlob);
                        }
                    });
            });
        } catch (error) {
            logger.log(error);
        }
    }

    handlePostBlobDownload(res, downloadedBlob, filePath) {
        try {
            res.download(filePath, function(err) {
                //Delete file after download
                if (!err) {
                    fs.unlinkSync(filePath)
                }
            });
        } catch (error) {
            logger.log(error);
        }
    }

}

module.exports = AzureHelper;