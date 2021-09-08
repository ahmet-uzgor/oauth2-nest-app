import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as multerS3 from 'multer-s3';
import { getS3 } from './aws.helper';

export const profileImageUpload = {
  storage: multerS3({
    s3: getS3(),
    bucket: 'tipstory',
    acl: 'public-read',
    key: function (request, file, cb) {
      const filename: string = uuidv4();
      const extension: string = path.parse(file.originalname).ext.toLowerCase();
      if (!extension.match(/\.(jpg|jpeg|png|gif)$/))
        cb(
          new HttpException(
            `Unsupported file type ${extension}`,
            HttpStatus.BAD_REQUEST,
          ),
          null,
        );
      cb(null, `${filename}${extension}`);
    },
  }),
  limits: {
    fieldSize: +process.env.PROFILE_IMAGE_NAME_MAX_SIZE * 1024 * 1024,
    fileSize: +process.env.PROFILE_IMAGE_FILE_MAX_SIZE * 1024 * 1024,
  },
};

export const cardImageUpload = {
  storage: multerS3({
    s3: getS3(),
    bucket: 'tipstory',
    acl: 'public-read',

    key: function (request, file, cb) {
      const filename: string = uuidv4();
      const extension: string = path.parse(file.originalname).ext.toLowerCase();
      if (!extension.match(/\.(jpg|jpeg|png|gif)$/))
        cb(
          new HttpException(
            `Unsupported file type ${extension}`,
            HttpStatus.BAD_REQUEST,
          ),
          null,
        );
      cb(null, `${filename}${extension}`);
    },
  }),

  limits: {
    fieldSize: +process.env.PROFILE_IMAGE_NAME_MAX_SIZE * 1024 * 1024,
    fileSize: +process.env.PROFILE_IMAGE_FILE_MAX_SIZE * 1024 * 1024,
  },
};
