import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('statistic')
@ApiTags('Statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Public()
  @Post()
  create(@Request() req, @Body() createStatisticDto: CreateStatisticDto) {
    try {
      return this.statisticService.create(req, createStatisticDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Public()
  @Get('excel-export')
  async excelExport(@Res() res) {
    try {
      const fileName = 'statistic-details';

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${fileName}.xlsx`,
      });

      const stream = await this.statisticService.excelExport(fileName);

      return stream.pipe(res);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
