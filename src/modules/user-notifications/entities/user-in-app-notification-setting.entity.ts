import {
  Column, Entity, JoinColumn, ManyToOne, OneToOne
} from 'typeorm';
import { InAppNotification } from './in-app-notification.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/user.entity';

@Entity({ name: 'user_inapp_notification_settings' })
export class UserInAppNotificationSetting extends BaseEntity {
  @ManyToOne('User')
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne('InAppNotification')
  @JoinColumn({ name: 'inAppNotificationId' })
  inAppNotification: InAppNotification;

  @Column({
    type: 'boolean',
    default: true,
  })
  enable: boolean;
}
