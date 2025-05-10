import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '../../common/aws/aws.module'
import { CommonModule } from '../../common/common.module';
import { UserNotificationSettingRepository } from '../user-notifications/repositories/user-notification-setting.repository';
import { UserRepository } from '../users/repositories/user.repository';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { VerificationRepository } from './verifications/verification.repository';
import { VerificationsModule } from './verifications/verifications.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserNotificationSettingRepository,
      VerificationRepository,
    ]),
    AwsModule,
    VerificationsModule,
    CommonModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
