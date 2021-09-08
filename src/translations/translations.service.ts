import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { Repository } from 'typeorm';
import { TranslateTranslationRepository } from './translate-translation.repository';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation)
    private translationsRepository: Repository<Translation>,
    private translateTranslationsRepository: TranslateTranslationRepository,
  ) {}
  async create(data: any) {
    return await this.translationsRepository.save(data);
  }

  createTranslateTranslation(data: any) {
    return this.translateTranslationsRepository.save(data);
  }

  async findAll(locale: string) {
    const translations =
      await this.translateTranslationsRepository.getAllTranslateTranslations(
        locale,
      );
    const newObject = {};
    translations.forEach((t) => {
      newObject[t.key] = t.value;
    });
    return {
      data: newObject,
    };
  }

  async findOne(id: number) {
    return await this.translationsRepository.findOne(id, {
      relations: ['translateTranslations'],
    });
  }

  async update(id: number, data) {
    const translation = await this.findOne(id);
    if (!translation) {
      throw new NotFoundException(`Translation with ID=${id} not found`);
    }
    return {
      data: await this.translationsRepository.save({
        id,
        ...data,
      }),
    };
  }

  async remove(id: number) {
    const translation = await this.translationsRepository.findOne(id);
    console.log(translation);
    if (!translation)
      throw new NotFoundException(`Translation with ID=${id} not found`);
    return await this.translationsRepository.softDelete(id);
  }
}
