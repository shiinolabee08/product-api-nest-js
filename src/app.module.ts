import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { UserNotificationsModule } from './modules/user-notifications/user-notifications.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ProductsModule, UsersModule, UserNotificationsModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
