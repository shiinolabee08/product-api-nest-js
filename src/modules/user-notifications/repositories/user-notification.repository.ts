import { EntityRepository, Repository } from 'typeorm';
import { UserNotification } from '../entities/user-notification.entity';

@EntityRepository(UserNotification)
export class UserNotificationRepository extends Repository<UserNotification> {}
