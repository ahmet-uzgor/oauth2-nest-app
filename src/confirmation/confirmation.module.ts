import { Module } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { ConfirmationController } from './confirmation.controller';
import { Confirmation } from './confirmation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Confirmation])],
  providers: [ConfirmationService],
  controllers: [ConfirmationController],
  exports: [ConfirmationService],
})
export class ConfirmationModule {}
