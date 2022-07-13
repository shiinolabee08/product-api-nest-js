import { EntityRepository, Repository } from 'typeorm';
import { UserNotificationSetting } from '../entities/user-notification-setting.entity';

@EntityRepository(UserNotificationSetting)
export class UserNotificationSettingRepository extends Repository<UserNotificationSetting> {}
