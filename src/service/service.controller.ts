import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ServiceService } from './service.service';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import {
  existsSync,
  writeFileSync,
  appendFileSync,
  statSync,
  readFileSync,
} from 'fs';
import * as path from 'path';
import { getS3 } from 'src/common/helpers/aws.helper';
import { uploadWithLink } from 'src/common/helpers/cdn-upload.helper';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('fluent-ffmpeg');

@Controller('service')
@ApiTags('Service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @Public()
  @Get('unsplash')
  async getPhotos(
    @Query('search') search: string,
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    return {
      data: await this.serviceService.unsplashSearch(search, page, perPage),
    };
  }

  @Public()
  @Get('unsplash-random')
  async getRandomPhotos(@Query('count') count: string) {
    return {
      data: await this.serviceService.getRandomFromUnsplash(count),
    };
  }

  @Public()
  @Get('giphy')
  // @ApiQuery({
  //   name: 'search',
  //   required: true,
  // })
  async getGifs(
    @Query('search') search: string,
    @Query('limit') limit: string,
  ) {
    return { data: await this.serviceService.giphySearch(search, limit) };
  }

  @Public()
  @Get('giphy-trends')
  async getTrendGifs(@Query('limit') limit: string) {
    return { data: await this.serviceService.getGiphyTrends(limit) };
  }

  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @Post('file-upload-chunk')
  async postFileUpload(@UploadedFile() file, @Body() body) {
    let { fileId } = body;
    const { fileSize } = body;
    fileId = fileId || uuidv4();
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const filePath = `${process.env.PUBLIC_PATH}/excel/${fileId}${fileExtension}`;
    const Bucket = process.env.BUCKET_NAME;

    const data = {
      fileId,
    };

    if (!existsSync(filePath)) writeFileSync(filePath, file.buffer, 'binary');
    else appendFileSync(filePath, file.buffer, 'binary');

    const { size } = statSync(filePath);

    if (size == fileSize) {
      const file = readFileSync(filePath);

      if (fileExtension.match(/(avi|mp4)$/)) {
        const duration = await new Promise((resolve) => {
          ffmpeg.ffprobe(filePath, (err, metadata) => {
            resolve(metadata.format.duration);
          });
        });

        if (duration >= 30)
          return { statusCode: 400, message: 'süresi 30 snden büyük olamaz' };
      }

      const params = {
        Bucket,
        Key: `${fileId}${fileExtension}`,
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
      data[
        'url'
      ] = `https://${Bucket}.nyc3.digitaloceanspaces.com/${fileId}${fileExtension}`;
    }

    return { statusCode: 200, data };
  }

  @Public()
  @Get('download-file')
  async downloadImage(@Query('link') link: string) {
    return { data: { url: await uploadWithLink(link) } };
  }
}
