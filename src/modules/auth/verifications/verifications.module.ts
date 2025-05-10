import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationRepository } from './verification.repository';
import { VerificationsService } from './verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationRepository])],
  providers: [VerificationsService],
  exports: [VerificationsService, TypeOrmModule],
})
export class VerificationsModule {}
