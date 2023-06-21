const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

// varibales for s3 bucket
const bucketName = "sygnamax-image-bucket";
const bucketRegion = "us-east-1";
const accessKey = "AKIA2GJ6LNE25TF2WXR4";
const secretAccessKey = "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";

const client = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const uploadFile = async (file, key) => {
  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: file,
  };

  const command = new PutObjectCommand(uploadParams);
  const res = await client.send(command);
  return res;
};

exports.uploadFile = uploadFile;
