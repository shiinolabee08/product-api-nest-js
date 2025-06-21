import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { UserNotificationsModule } from './modules/user-notifications/user-notifications.module';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductCategoriesModule } from './modules/product-categories/product-categories.module';

const environment = process.env.NODE_ENV || '';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/${environment}.env`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService | any) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        synchronize: false,
        logging: true,
      }),
    }),
    AuthModule,
    RolesModule,
    ProductsModule,
    UsersModule,
    UserNotificationsModule,
    CommonModule,
    ProductCategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
