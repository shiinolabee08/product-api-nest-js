import {
  Column, Entity, JoinColumn, OneToOne,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base-entity';
import { FmTemplate } from '../../fm-templates/entities/fm-template.entity';

@Entity({ name: 'email_notifications' })
export class EmailNotification extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true
  })
  name: string;

  @OneToOne('FmTemplate')
  @JoinColumn({ name: 'fmTemplateId' })
  fmTemplate: FmTemplate;
}
