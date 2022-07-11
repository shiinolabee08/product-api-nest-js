import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { UsersController } from './controllers/users.controller';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
    ]),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
