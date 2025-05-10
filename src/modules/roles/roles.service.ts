import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions } from 'typeorm';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  private readonly roles: Role[];

  constructor(
    @InjectRepository(Role) private rolesRepository: RoleRepository,
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  findById(roleId: number): Promise<Role> {
    return this.rolesRepository.findOneOrFail(roleId);
  }

  findOne(data, options?: FindOneOptions): Promise<Role> {
    return this.rolesRepository.findOne(data, options);
  }

  create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesRepository.save(createRoleDto);
  }

  async update(roleId: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.rolesRepository.update(roleId, updateRoleDto);
    return this.rolesRepository.findOneOrFail(roleId);
  }

  softDelete(roleId: number): Promise<DeleteResult> {
    return this.rolesRepository.softDelete(roleId);
  }
}
