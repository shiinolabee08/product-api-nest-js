import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { Not } from 'typeorm';
import { RolesService } from '../roles.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class CheckRoleEmailExistsPipe implements PipeTransform {
  constructor(private readonly rolesService: RolesService) {}

  private readonly logger = new Logger(CheckRoleEmailExistsPipe.name);

  async transform(roleDto: CreateRoleDto | UpdateRoleDto) {
    if (!roleDto || !roleDto.name) {
      throw new UnprocessableEntityException('Role name must not be empty');
    }

    let role;

    if (roleDto.id) {
      role = await this.rolesService.findOne({
        name: roleDto.name,
        id: Not(roleDto.id),
      });
    } else {
      role = await this.rolesService.findOne({ name: roleDto.name });
    }

    if (role) {
      throw new UnprocessableEntityException('Role name already in use');
    }

    return roleDto;
  }
}
