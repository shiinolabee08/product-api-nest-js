import {
  Entity,
  Column,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;
}
