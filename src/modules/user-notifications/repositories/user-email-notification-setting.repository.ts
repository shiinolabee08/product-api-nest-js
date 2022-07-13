import { EntityRepository, Repository } from 'typeorm';
import { UserEmailNotificationSetting } from '../entities/user-email-notification-setting.entity';

@EntityRepository(UserEmailNotificationSetting)
export class UserEmailNotificationSettingRepository extends Repository<UserEmailNotificationSetting> {}
