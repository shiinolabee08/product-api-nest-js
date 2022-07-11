import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { CreateUserRequestDto } from '../dtos/request/create-user.request.dto';
import { UsersService } from '../services/users.service';
import { User } from '../user.entity';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private usersService: UsersService
  ) {}

  @Get()
  getUsers(@Req() request): Promise<User[]> {
    const filters = { ...request.params, ...request.query };
    return this.usersService.findAll(filters);
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) userId: number): Promise<User> {
    return this.usersService.getUser(userId);
  }

  @Post()
  async createUser(@Body() createUserRequestDto: CreateUserRequestDto, @Req() request) {
    return this.usersService.createUser(createUserRequestDto, request);
  }

}
