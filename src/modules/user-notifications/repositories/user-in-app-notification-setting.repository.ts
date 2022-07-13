import { EntityRepository, Repository } from 'typeorm';
import { UserInAppNotificationSetting } from '../entities/user-in-app-notification-setting.entity';

@EntityRepository(UserInAppNotificationSetting)
export class UserInAppNotificationSettingRepository extends Repository<UserInAppNotificationSetting> {}
