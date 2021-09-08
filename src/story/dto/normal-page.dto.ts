import { ApiProperty } from '@nestjs/swagger';

export class NormalPageDto {
  constructor(normalPage: {
    id: number;
    isValid: boolean;
    typeId: number;
    description: string;
    title: string;
    movable: boolean;
    descriptionVisible: boolean;
    titleVisible: boolean;
    media_url: string;
    position: number;
  }) {
    this.id = normalPage.id;
    this.isValid = normalPage.isValid;
    this.typeId = normalPage.typeId;
    this.title = normalPage.title;
    this.titleVisible = normalPage.titleVisible;
    this.descriptionVisible = normalPage.descriptionVisible;
    this.description = normalPage.description;
    this.movable = normalPage.movable;
    this.position = normalPage.position;
    this.media_url = normalPage.media_url;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  isValid: boolean;

  @ApiProperty()
  typeId: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  movable: boolean;

  @ApiProperty()
  descriptionVisible: boolean;

  @ApiProperty()
  titleVisible: boolean;

  @ApiProperty()
  position: number;

  @ApiProperty()
  media_url: string;
}
