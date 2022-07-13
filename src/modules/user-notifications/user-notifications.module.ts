import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotificationSettingRepository } from './repositories/user-notification-setting.repository';
import { EmailNotificationListener } from './listeners/email-notification.listener';
import { CommonModule } from '../../common/common.module';
import { EmailNotificationService } from './services/email-notification.service';
import { InAppNotificationService } from './services/in-app-notification.service';
import { EventNotificationService } from './services/event-notification.service';
import { UserNotificationRepository } from './repositories/user-notification.repository';
import { EmailNotificationRepository } from './repositories/email-notification.repository';
import { UserNotificationsController } from './user-notifications.controller';
import { InAppNotificationRepository } from './repositories/in-app-notification.repository';
import { UserEmailNotificationSettingRepository } from './repositories/user-email-notification-setting.repository';
import { UserInAppNotificationSettingRepository } from './repositories/user-in-app-notification-setting.repository';
import { InAppNotificationListener } from './listeners/in-app-notification.listener';
import { UserNotificationService } from './services/user-notification.service';

@Global()
@Module({
  imports: [
    CommonModule,
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: true,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: true,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 4,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: true,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    TypeOrmModule.forFeature([
      EmailNotificationRepository,
      InAppNotificationRepository,
      UserEmailNotificationSettingRepository,
      UserInAppNotificationSettingRepository,
      UserNotificationSettingRepository,
      UserNotificationRepository,
    ]),
  ],
  providers: [
    UserNotificationService, EventNotificationService,
    EmailNotificationService, InAppNotificationService,
    EmailNotificationListener, InAppNotificationListener
  ],
  exports: [UserNotificationService, EmailNotificationService, InAppNotificationService],
  controllers: [UserNotificationsController],
})
export class UserNotificationsModule {}
