import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';

/**
 * Service dealing with language based operations.
 *
 * @class
 */
@Injectable()
export class LanguageService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Language>} languageRepository
   */
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}
  /**
   * Seed all languages.
   *
   * @function
   */
  async create(language) {
    return await this.languageRepository.save(language);
  }

  async findOne(data) {
    return await this.languageRepository.findOne(data);
  }
}
