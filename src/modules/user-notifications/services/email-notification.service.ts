import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';
import { EmailNotification } from '../entities/email-notification.entity';
import { UserEmailNotificationSetting } from '../entities/user-email-notification-setting.entity';
import { UserNotificationSetting } from '../entities/user-notification-setting.entity';
import { EmailEvent } from '../events/email/email.event';
import { EmailNotificationRepository } from '../repositories/email-notification.repository';
import { UserEmailNotificationSettingRepository } from '../repositories/user-email-notification-setting.repository';
import { UserNotificationSettingRepository } from '../repositories/user-notification-setting.repository';
import { EventNotificationService } from './event-notification.service';
import { NotificationService } from './notification.base.service';
// import { SendFmTemplateTransactionRequestDto } from '../../fm-templates/dto/request/send-fm-template-transaction.request.dto';
import { AnyAaaaRecord } from 'node:dns';

@Injectable()
export class EmailNotificationService extends NotificationService {
  private logger = new Logger(EmailNotificationService.name);

  constructor(
    @InjectRepository(EmailNotification)
    private emailNotificationRepository: EmailNotificationRepository,

    @InjectRepository(UserEmailNotificationSetting)
    private userEmailNotificationSettingRepository: UserEmailNotificationSettingRepository,

    private eventNotificationService: EventNotificationService,

    @InjectRepository(UserNotificationSetting)
    userNotificationSettingRepository: UserNotificationSettingRepository,
    private authService: AuthService,
  ) {
    super(userNotificationSettingRepository);
  }

  private getEmailNotification(name: string): Promise<EmailNotification> {
    return this.emailNotificationRepository.findOne({
      name
    }, { relations: ['fmTemplate'] });
  }

  protected getAuthUser() {
    const user = this.authService.getAuthUser();

    if (user) {
      return user;
    }

    return null;
  }

  private getUserEmailNotificationSetting(emailNotificationId: number): Promise<UserEmailNotificationSetting> {
    const user = this.getAuthUser();

    if (user) {
      return this.userEmailNotificationSettingRepository.findOne({
        user: {
          id: user.id
        }, // authenticated userId
        emailNotification: {
          id: emailNotificationId
        } as unknown as EmailNotification,
      });
    }

    return null;
  }

  /**
   * @param emailEvent EmailEvent
   */
  async sendEmail<T>(emailEvent: EmailEvent<T>) {
    try {
      const user = this.getAuthUser();

      const isEmailEnabled = !user || await this.isEmailEnabled();

      if (isEmailEnabled || isEmailEnabled === undefined) {
        const emailNotification = await this.getEmailNotification(emailEvent.name); // name of the template

        // check if user enables the email notification using user_email_notification_settings
        // if yes, then get the template using the getUserEmailNotificationSetting
        const userEmailNotificationSetting = await this.getUserEmailNotificationSetting(emailNotification.id); // provide EmailNotification.id

        if (!userEmailNotificationSetting || userEmailNotificationSetting.enable) {
          const sendTransactionEmailRequestDto = {
            id: emailNotification.id,
            tokens: emailEvent.metaData,
            recipient: emailEvent.recipient,
          };
          this.eventNotificationService.sendEmailNotificationEvent(emailEvent.name, sendTransactionEmailRequestDto as any);
        }
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Sending email notification ocurred an error.');
    }
  }
}
