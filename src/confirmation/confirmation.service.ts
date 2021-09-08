import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Confirmation } from './confirmation.entity';
import { ConfirmationInterface } from './confirmation.interface';

@Injectable()
export class ConfirmationService {
  constructor(
    @InjectRepository(Confirmation)
    private readonly confirmationRepository: Repository<Confirmation>,
  ) {}

  async create(
    confirmation: ConfirmationInterface,
  ): Promise<ConfirmationInterface> {
    return await this.confirmationRepository.save(confirmation);
  }

  async findOne(data: any): Promise<ConfirmationInterface> {
    return await this.confirmationRepository.findOne(data);
  }

  async resendConfirmation(
    email: string,
    code: number,
  ): Promise<ConfirmationInterface> {
    return await this.confirmationRepository.findOne({
      where: {
        email,
        code,
      },
    });
  }

  async delete(confirmation: ConfirmationInterface) {
    await this.confirmationRepository.delete(confirmation);
  }

  async deleteAll(email) {
    await this.confirmationRepository.delete({ email });
  }
}
