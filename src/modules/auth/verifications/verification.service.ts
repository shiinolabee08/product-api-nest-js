import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult, Equal, FindOneOptions, LessThanOrEqual,
} from 'typeorm';
import { Verification } from './verification.entity';
import { VerificationRepository } from './verification.repository';
import { VerificationDto } from './dto/verification.dto';
import { VerificationTypes } from './enums/verifications.enum';
import { VerifyRequestDto } from '../dtos/verify.request.dto';

@Injectable()
export class VerificationsService {
  private readonly verifications: Verification[];

  constructor(
    @InjectRepository(Verification)
    private verificationRepository: VerificationRepository,
  ) {}

  create(verificationDto: VerificationDto): Promise<Verification> {
    return this.verificationRepository.save(verificationDto);
  }

  verifyCode(data: VerifyRequestDto): Promise<Verification> {
    return this.findOne({
      where: {
        email: data.email,
        code: Equal(data.code),
        type: VerificationTypes.USER_CREATION,
        expireIn: LessThanOrEqual('NOW()'),
      },
    });
  }

  verifyAccountWithdrawal(data: VerifyRequestDto): Promise<Verification> {
    return this.findOne({
      where: {
        email: data.email,
        code: Equal(data.code),
        type: VerificationTypes.USER_WITHDRAWAL,
        expireIn: LessThanOrEqual('NOW()'),
      },
    });
  }

  findOne(data, options?: FindOneOptions): Promise<Verification> {
    return this.verificationRepository.findOneOrFail(data, options);
  }

  delete(email: string): Promise<DeleteResult> {
    return this.verificationRepository.delete({ email });
  }
}
