import { ApiProperty } from '@nestjs/swagger';

export class PodcastPageDto {
  constructor(podcastPage: {
    id: number;
    isValid: boolean;
    typeId: number;
    title: string;
    movable: boolean;
    media_url: string;
    position: number;
  }) {
    this.id = podcastPage.id;
    this.isValid = podcastPage.isValid;
    this.typeId = podcastPage.typeId;
    this.title = podcastPage.title;
    this.movable = podcastPage.movable;
    this.media_url = podcastPage.media_url;
    this.position = podcastPage.position;
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
