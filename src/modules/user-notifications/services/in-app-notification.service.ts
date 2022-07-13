import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Handlebars from 'handlebars';
import { AuthService } from '../../auth/auth.service';
import { InAppNotification } from '../entities/in-app-notification.entity';
import { UserInAppNotificationSetting } from '../entities/user-in-app-notification-setting.entity';
import { UserNotificationSetting } from '../entities/user-notification-setting.entity';
import { UserNotification } from '../entities/user-notification.entity';
import { InAppEvent } from '../events/in-app/in-app.event';
import { InAppNotificationRepository } from '../repositories/in-app-notification.repository';
import { UserInAppNotificationSettingRepository } from '../repositories/user-in-app-notification-setting.repository';
import { UserNotificationSettingRepository } from '../repositories/user-notification-setting.repository';
import { EventNotificationService } from './event-notification.service';
import { NotificationService } from './notification.base.service';

@Injectable()
export class InAppNotificationService extends NotificationService {
  private logger = new Logger(InAppNotificationService.name);

  constructor(
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: InAppNotificationRepository,

    @InjectRepository(UserInAppNotificationSetting)
    private userInAppNotificationSettingRepository: UserInAppNotificationSettingRepository,

    private eventNotificationService: EventNotificationService,

    @InjectRepository(UserNotificationSetting)
    userNotificationSettingRepository: UserNotificationSettingRepository,

    private authService: AuthService,
  ) {
    super(userNotificationSettingRepository);
  }

  private getInAppNotification(name: string): Promise<InAppNotification> {
    return this.inAppNotificationRepository.findOne({
      name
    });
  }

  protected getAuthUser() {
    const user = this.authService.getAuthUser();

    if (user) {
      return user;
    }

    return null;
  }

  private getUserInAppNotificationSetting(inAppNotificationId: number): Promise<UserInAppNotificationSetting> {
    const user = this.getAuthUser();

    if (user) {
      return this.userInAppNotificationSettingRepository.findOne({
        user: {
          id: this.authService.getAuthUser().id
        }, // authenticated userId
        inAppNotification: {
          id: inAppNotificationId,
        },
      });
    }

    return null;
  }

  /**
   * @param inAppEvent InAppEvent
   */
  async sendInApp<T>(inAppEvent: InAppEvent<T>, channel = 'notifications-user') {
    try {
      const user = this.getAuthUser();
      const isInAppEnabled = !user || await this.isInAppEnabled();

      if (isInAppEnabled || isInAppEnabled === undefined) {
        const inAppNotification = await this.getInAppNotification(inAppEvent.name);

        // check if user enables the in-app notification using user_in_app_notification_settings
        // if yes, then get the template using the getUserInAppNotificationSetting
        const userInAppNotificationSetting = await this.getUserInAppNotificationSetting(inAppNotification.id); // provide InAppNotification.id

        if (!userInAppNotificationSetting || userInAppNotificationSetting.enable) {
          const templateBody = Handlebars.compile(inAppNotification.template);
          const requiredData = inAppEvent.metaData;
          const parsedBody = templateBody(requiredData);

          const userNotificationRecord = {
            ...inAppEvent,
            toUser: {
              id: inAppEvent.toUserId
            },
            fromUser: {
              id: inAppEvent.fromUserId
            },
            content: parsedBody,
            /* state: inAppEvent.state || NotificationStateEnum.UNREAD,
            type: inAppEvent.type,
            sourceId: inAppEvent.sourceId,
            sourceType: inAppEvent.sourceType,
            metadata: JSON.stringify(inAppEvent.metaData), */
          } as unknown as UserNotification;

          this.eventNotificationService.sendInAppNotificationEvent(inAppEvent.name, userNotificationRecord, channel);
        }
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Sending email notification ocurred an error.');
    }
  }
}

// additional task
/**
 * For registration
 *  - create default user_notification_setting and make them enabled
 * for migration
 *  - create migration for existing users to create record in user_notification_setting and make all the fields enable
 */
