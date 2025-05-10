import {
  Column, Entity,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity({ name: 'email_notifications' })
export class EmailNotification extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true
  })
  name: string;
}
