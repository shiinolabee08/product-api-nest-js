import {
  Column, Entity, JoinColumn, ManyToOne,
} from 'typeorm';
import { EmailNotification } from './email-notification.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/user.entity';

@Entity({ name: 'user_email_notification_settings' })
export class UserEmailNotificationSetting extends BaseEntity {
  @ManyToOne('User')
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne('EmailNotification')
  @JoinColumn({ name: 'emailNotificationId' })
  emailNotification: EmailNotification;

  @Column({
    type: 'boolean',
    default: true,
  })
  enable: boolean;
}
