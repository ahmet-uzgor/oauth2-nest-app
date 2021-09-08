import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getS3 } from './aws.helper';
import * as fs from 'fs';

export async function uploadWithLink(link: string): Promise<string> {
  const response = await axios({
    url: link,
    responseType: 'stream',
  });

  const fileExtension =
    response.headers['content-type'].match(/(jpg|jpeg|png|gif)$/)[0];

  const fileId = uuidv4();
  const filePath = `${process.env.PUBLIC_PATH}/excel/${fileId}.${fileExtension}`;

  const writeStream = fs.createWriteStream(filePath);

  await new Promise((resolve) => {
    response.data.pipe(writeStream).on('finish', () => resolve(true));
  });

  const Bucket = process.env.BUCKET_NAME;

  const file = fs.readFileSync(filePath);

  const params = {
    Bucket,
    Key: `${fileId}.${fileExtension}`,
    Body: file,
    ACL: 'public-read',
    Metadata: {
      'x-amz-meta-my-key': fileId,
    },
  };
  await getS3().putObject(params).promise();

  getS3().getSignedUrl('getObject', {
    Bucket,
    Key: `${fileId}${fileExtension}`,
  });

  return `https://${Bucket}.nyc3.digitaloceanspaces.com/${fileId}.${fileExtension}`;
}
