import { EntityRepository, Repository } from 'typeorm';
import { EmailNotification } from '../entities/email-notification.entity';

@EntityRepository(EmailNotification)
export class EmailNotificationRepository extends Repository<EmailNotification> {}
