import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserVerificationStatusEnum } from '../../common/enums/user-verification-status.enum';
import { Role } from '../roles/role.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  birthDate: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: null,
  })
  postcode: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  verifiedEmail: boolean;

  @Column({
    type: 'enum',
    enum: UserVerificationStatusEnum,
    default: UserVerificationStatusEnum.PENDING_VERIFICATION,
  })
  userVerificationStatus: UserVerificationStatusEnum;

  @Column({
    type: 'varchar',
    length: 255,
    default: null,
  })
  contactNo: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: null,
  })
  address: string;

  @ManyToOne('Role', { eager: true })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
