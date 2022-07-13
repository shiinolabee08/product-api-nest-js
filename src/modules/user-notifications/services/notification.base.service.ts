import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { UserNotificationSetting } from '../entities/user-notification-setting.entity';
import { UserNotificationSettingRepository } from '../repositories/user-notification-setting.repository';

export abstract class NotificationService {
  constructor(
    // UserNotificationSettingRepo - get the notification setting for that user
    @InjectRepository(UserNotificationSetting)
    private userNotificationSettingRepository: UserNotificationSettingRepository,
  ) {}

  protected getUserNotificationSetting(): Promise<UserNotificationSetting> {
    const user = this.getAuthUser();

    if (user) {
      return this.userNotificationSettingRepository.findOne({
        user: { id: user.id } // authenticated userId
      });
    }

    return null;
  }

  protected abstract getAuthUser(): User;

  protected async isEmailEnabled() {
    const setting = await this.getUserNotificationSetting();

    return setting?.enableEmail;
  }

  protected async isInAppEnabled() {
    const setting = await this.getUserNotificationSetting();
    return setting?.enableInApp;
  }
}
