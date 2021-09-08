import * as AWS from 'aws-sdk';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '../../../', `.${process.env.NODE_ENV}.env`),
});

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');

export function getS3() {
  return new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
}
