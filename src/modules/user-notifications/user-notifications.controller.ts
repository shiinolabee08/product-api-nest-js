import {
  Body,
  Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, ValidationPipe
} from '@nestjs/common';
import { AuthResponse } from 'pusher';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PusherService } from '../../common/services/pusher.service';
import { AuthService } from '../auth/auth.service';
import { AuthenticatePusherRequestDto } from './dto/authenticate-pusher.request.dto';
import { UpdateUserNotificationRequestDto } from './dto/update-user-notification.request.dto';
import { UserNotification } from './entities/user-notification.entity';
import { UserNotificationService } from './services/user-notification.service';

@UseGuards(AuthGuard)
@Controller('user-notifications')
export class UserNotificationsController {
  constructor(
    private userNotificationService: UserNotificationService,
    private authService: AuthService,
    private pusherService: PusherService,
  ) {}

  @Get()
  findByUser(): Promise<UserNotification[]> {
    const userId = this.authService.getAuthUser().id;
    return this.userNotificationService.fetchNotifications({ where: { toUser: { id: userId }, dateDeleted: null } });
  }

  @HttpCode(HttpStatus.OK)
  @Post('authenticate')
  async authenticatePusher(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
      }),
    )
      pusherSocketData: AuthenticatePusherRequestDto
  ): Promise<AuthResponse> {
    const user = this.authService.getAuthUser();
    const pusherInstance = this.pusherService.getPusherInstance();
    const authenticateFormData = {
      socket: pusherSocketData.socket_id,
      channel: pusherSocketData.channel_name,
      presenceData: {
        user_id: `${user.id}`,
        user_info: user,
      }
    };

    return pusherInstance.authenticate(authenticateFormData.socket, authenticateFormData.channel, authenticateFormData.presenceData);
  }

  @Put('/:notificationId')
  async updateNotification(
    @Param('notificationId') notificationId: number,
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          validateCustomDecorators: true,
        }),
      )
      updateNotificationRequestDto: UpdateUserNotificationRequestDto
  ): Promise<UserNotification> {
    const response = await this.userNotificationService.updateNotification(notificationId, updateNotificationRequestDto);

    return response;
  }

  @Delete('/:notificationId')
  async deleteNotification(
    @Param('notificationId') notificationId: number,
  ): Promise<DeleteResult> {
    return this.userNotificationService.deleteNotification(notificationId);
  }
}
