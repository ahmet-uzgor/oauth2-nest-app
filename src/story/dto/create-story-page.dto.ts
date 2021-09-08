import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Column } from 'typeorm';

export class CreateStoryPageDto {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @IsOptional()
  @Column()
  button_name: string;

  @ApiProperty()
  @IsOptional()
  @Column()
  image: string;

  @ApiProperty()
  @IsOptional()
  @Column()
  button_url: string;

  @ApiProperty()
  @IsOptional()
  @Column()
  typeId: number;
}
