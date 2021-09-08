import { ApiProperty } from '@nestjs/swagger';
import { QuizChoice } from '../entities/choice.entity';

export class QuizPageDto {
  constructor(quizPage: {
    id: number;
    isValid: boolean;
    typeId: number;
    description: string;
    title: string;
    movable: boolean;
    quizChoices: QuizChoice[];
    selectedOptionId: number;
    position: number;
  }) {
    this.id = quizPage.id;
    this.isValid = quizPage.isValid;
    this.typeId = quizPage.typeId;
    this.description = quizPage.description;
    this.title = quizPage.title;
    this.movable = quizPage.movable;
    this.quizChoices = quizPage.quizChoices;
    this.selectedOptionId = quizPage.selectedOptionId;
    this.position = quizPage.position;
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
  readonly quizChoices: QuizChoice[];

  @ApiProperty()
  selectedOptionId: number;

  @ApiProperty()
  position: number;
}
