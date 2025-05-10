import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Delete,
  Put,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CustomParamsDecorator } from '../../common/decorators/custom-params.decorator';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CheckRoleEmailExistsPipe } from './pipes/check-role-exists.pipe';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

@UseGuards(AuthGuard, AdminGuard)
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) roleId: number): Promise<Role> {
    return this.rolesService.findById(roleId);
  }

  @Post()
  create(
    @CustomParamsDecorator(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
      }),
      CheckRoleEmailExistsPipe,
    )
      createRoleDto: CreateRoleDto,
  ): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) roleId: number,
      @CustomParamsDecorator(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          validateCustomDecorators: true,
        }),
        CheckRoleEmailExistsPipe,
      )
      updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(roleId, updateRoleDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) roleId: number): Promise<DeleteResult> {
    return this.rolesService.softDelete(roleId);
  }
}
