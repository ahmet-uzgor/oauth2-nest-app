import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { TranslateTranslation } from './entities/translate-translation.entity';
import { TranslateTranslationRepository } from './translate-translation.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Translation,
      TranslateTranslation,
      TranslateTranslationRepository,
    ]),
  ],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TypeOrmModule],
})
export class TranslationsModule {}
