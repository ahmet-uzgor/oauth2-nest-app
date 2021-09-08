import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistic } from './entities/statistic.entity';
import { writeFile, utils } from 'xlsx';
import * as fs from 'fs';

@Injectable()
export class StatisticService {
  constructor(
    private readonly jwt: JwtService,
    private userService: UsersService,
    @InjectRepository(Statistic)
    private statisticRepository: Repository<Statistic>,
  ) {}

  async create(req, createStatisticDto: CreateStatisticDto) {
    const accessToken = req.cookies['accessToken'] || '';
    const trackId = req.cookies['track-id'] || '';
    let newStatistic = {};

    const decodedToken = this.jwt.decode(accessToken);

    if (decodedToken && new Date(decodedToken['exp'] * 1000) > new Date()) {
      const user = await this.userService.findOne({
        salt: decodedToken['salt'],
      });

      newStatistic = {
        ...createStatisticDto,
        user: user.id,
        trackId,
        userType: 'registeredUser',
      };
    } else
      newStatistic = {
        ...createStatisticDto,
        trackId,
        userType: 'guestUser',
      };
    return { data: await this.statisticRepository.save(newStatistic) };
  }

  findAll() {
    return `This action returns all statistic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }

  async findOneWithPageId(pageId: number, event) {
    const stats = await this.statisticRepository.find({
      pageId,
      event,
    });
    return stats.length;
  }

  async excelExport(fileName) {
    const response = await this.statisticRepository.find();

    const ws = utils.json_to_sheet(response);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'People');

    const path = `${process.env.PUBLIC_PATH}/excel/${fileName}.xlsx`;

    writeFile(wb, path, { type: 'file' });
    const stream = fs.createReadStream(path);

    stream.on('end', () => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });

    return stream;
  }
}
