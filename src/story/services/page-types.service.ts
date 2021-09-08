import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePageTypeDto } from '../dto/update-page-type.dto';
import { PageType } from '../entities/page-type.entity';
import { PageTypeTranslationRepository } from '../repositories/page-type.repository';

@Injectable()
export class PageTypeService {
  constructor(
    @InjectRepository(PageType)
    private readonly pageTypeRepository: Repository<PageType>,
    private readonly pageTypeTranslationRepository: PageTypeTranslationRepository,
  ) {}
  async create(data) {
    return await this.pageTypeRepository.save(data);
  }

  async findAll(locale) {
    return {
      data: await this.pageTypeTranslationRepository.getAllTranslations(locale),
    };
  }

  async findOneWhereByLocale(id, locale) {
    return await this.pageTypeTranslationRepository.getTranslation(id, locale);
  }

  async findOne(id) {
    return await this.pageTypeRepository.findOne(id);
  }

  async findOneWhereByKey(code) {
    return await this.pageTypeRepository.findOne({ code });
  }

  async update(id: number, updateStoryTypeDto: UpdatePageTypeDto) {
    const page = await this.pageTypeRepository.findOne(id);
    if (!page) throw new NotFoundException(`story.PAGE_TYPE_NOT_FOUND`);
    return {
      data: await this.pageTypeRepository.save({ id, ...updateStoryTypeDto }),
    };
  }

  async remove(id: number) {
    return await this.pageTypeRepository.softDelete(id);
  }
}
