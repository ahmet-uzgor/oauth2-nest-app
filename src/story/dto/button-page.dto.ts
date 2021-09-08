import { ApiProperty } from '@nestjs/swagger';

export class ButtonPageDto {
  constructor(buttonPage: {
    id: number;
    isValid: boolean;
    typeId: number;
    description: string;
    button_name: string;
    movable: boolean;
    descriptionVisible: boolean;
    button_url: string;
    position: number;
  }) {
    this.id = buttonPage.id;
    this.isValid = buttonPage.isValid;
    this.typeId = buttonPage.typeId;
    this.descriptionVisible = buttonPage.descriptionVisible;
    this.description = buttonPage.description;
    this.movable = buttonPage.movable;
    this.position = buttonPage.position;
    this.button_url = buttonPage.button_url;
    this.button_name = buttonPage.button_name;
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
  movable: boolean;

  @ApiProperty()
  descriptionVisible: boolean;

  @ApiProperty()
  position: number;

  @ApiProperty()
  button_url: string;

  @ApiProperty()
  button_name: string;
}
