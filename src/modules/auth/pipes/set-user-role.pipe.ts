import { Injectable, PipeTransform } from '@nestjs/common';
import { RolesEnum } from 'src/common/enums/roles.enum';
import { CreateUserRequestDto } from '../dtos';

@Injectable()
export class SetUserRolePipe implements PipeTransform {
  constructor(private roleId: RolesEnum) {}

  async transform(createUserRequestDto: CreateUserRequestDto) {
    const user = { ...createUserRequestDto };

    user.roleId = this.roleId;

    return user;
  }
}
