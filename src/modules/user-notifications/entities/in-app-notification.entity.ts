import {
  Column, Entity
} from 'typeorm';

import { BaseEntity } from '../../../common/entities/base-entity';

@Entity({ name: 'inapp_notifications' })
export class InAppNotification extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  name: string;

  @Column({ type: 'mediumtext' })
  template: string;
}
