import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationTypeEnum } from '../../../common/enums/notification-type.enum';
import { PusherService } from '../../../common/services/pusher.service';
import { UserNotification } from '../entities/user-notification.entity';
import { UserNotificationService } from '../services/user-notification.service';

@Injectable()
export class InAppNotificationListener {
  private logger = new Logger(InAppNotificationListener.name);

  constructor(
    private userNotificationService: UserNotificationService,
    private pusherService: PusherService,
  ) {}

  @OnEvent(`${NotificationTypeEnum.IN_APP}.*`, { async: true })
  async handleInAppEvent(userNotification: UserNotification, channel: string) {
    // saving of notifications in here
    const userNotificationRecord = await this.userNotificationService.createUserNotification(userNotification);

    if (userNotificationRecord) {
      this.logger.log(`Successfully sent in-app notification to ${userNotificationRecord.toUser.firstName}`);
      this.pusherService.triggerChannel(`private-${channel}-${userNotificationRecord.toUser.id}`, 'user.notifications', userNotificationRecord);
    } else {
      this.logger.error(`Error occurred sending in-app notification to User #${userNotification.toUser.id}`);
    }
  }
}
