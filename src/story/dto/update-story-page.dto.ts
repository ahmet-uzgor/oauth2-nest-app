import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryPageDto } from './create-story-page.dto';

export class UpdateStoryPageDto extends PartialType(CreateStoryPageDto) {}
