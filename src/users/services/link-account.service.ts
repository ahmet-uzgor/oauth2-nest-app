import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinkAccount } from '../entities/link-account.entity';

@Injectable()
export class LinkAccountService {
  constructor(
    @InjectRepository(LinkAccount)
    private linkAccountRepository: Repository<LinkAccount>,
  ) {}
  async findOne(data: any): Promise<LinkAccount> {
    return await this.linkAccountRepository.findOne(data);
  }

  async create(data: any) {
    return await this.linkAccountRepository.save(data);
  }

  async remove(data: any) {
    return await this.linkAccountRepository.remove(data);
  }
}
