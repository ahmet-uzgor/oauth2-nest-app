import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn } from 'typeorm';
import { Statistic } from '../entities/statistic.entity';

export class CreateStatisticDto extends Statistic {
  @ApiProperty()
  @Column()
  event: string;

  @ApiProperty()
  readonly pageId: number;

  @ApiProperty()
  @Column()
  selectedId: string;

  @ApiProperty()
  @Column()
  durationTime: number;

  @ApiProperty()
  @CreateDateColumn()
  eventTime: Date;
}
