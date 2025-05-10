import {
  Column, Entity, JoinColumn, ManyToOne
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/user.entity';
import { NotificationInAppTypeEnum } from '../../../common/enums/notification-in-app-type.enum';
import { NotificationStateEnum } from '../../../common/enums/notification-state.enum';

@Entity({ name: 'user_notifications' })
export class UserNotification extends BaseEntity {
  @ManyToOne('User')
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @ManyToOne('User')
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  // #TODO: need to review
  @Column({
    type: 'varchar',
    length: '255',
  })
  sourceId: string;

  // #TODO: need to review
  @Column({
    type: 'varchar',
    length: '255',
  })
  sourceType: string;

  @Column({
    type: 'varchar',
    length: '255',
  })
  state: string | NotificationStateEnum;

  @Column({
    type: 'varchar',
    length: '255',
  })
  type: string | NotificationInAppTypeEnum;

  @Column({ type: 'mediumtext' })
  content: string;

  @Column({ type: 'json' })
  metadata: string;
}
