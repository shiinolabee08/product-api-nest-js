import { EntityRepository, Repository } from 'typeorm';
import { InAppNotification } from '../entities/in-app-notification.entity';

@EntityRepository(InAppNotification)
export class InAppNotificationRepository extends Repository<InAppNotification> {}
