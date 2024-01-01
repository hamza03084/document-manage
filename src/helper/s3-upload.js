const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const uploadFileToS3 = async (file, filename) => {
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename || file.filename,
    Body: file,
  };
  const uploadResult = await s3.upload(uploadParams).promise();
  return uploadResult.Location;
};

module.exports = {
  uploadFileToS3,
};
