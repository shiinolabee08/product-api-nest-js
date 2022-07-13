import {
  Column, Entity, JoinColumn, ManyToOne
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base-entity';
import { User } from '../../users/user.entity';

@Entity({ name: 'user_notification_settings' })
export class UserNotificationSetting extends BaseEntity {
  @ManyToOne('User')
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'boolean',
    default: true
  })
  enableEmail: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  enableInApp: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  enableSms: boolean;
}
