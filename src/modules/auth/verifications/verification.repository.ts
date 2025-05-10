import {
  EntityRepository, Equal, LessThanOrEqual, Repository
} from 'typeorm';
import { VerifyRequestDto } from '../dtos';
import { VerificationTypes } from './enums/verifications.enum';
import { Verification } from './verification.entity';

@EntityRepository(Verification)
export class VerificationRepository extends Repository<Verification> {
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
}
