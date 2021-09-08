import { ApiProperty } from '@nestjs/swagger';

export class TitlePageDto {
  constructor(titlePage: {
    id: number;
    isValid: boolean;
    typeId: number;
    media_url: string;
    title: string;
    movable: boolean;
    position: number;
  }) {
    this.id = titlePage.id;
    this.isValid = titlePage.isValid;
    this.typeId = titlePage.typeId;
    this.media_url = titlePage.media_url;
    this.title = titlePage.title;
    this.movable = titlePage.movable;
    this.position = titlePage.position;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  isValid: boolean;

  @ApiProperty()
  typeId: number;

  @ApiProperty()
  media_url: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  movable: boolean;

  @ApiProperty()
  position: number;
}
