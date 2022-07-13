import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOneOptions } from 'typeorm';
import { CreateUserNotificationSettingDto } from '../dto/create-user-notification-setting.dto';
import { UpdateUserNotificationRequestDto } from '../dto/update-user-notification.request.dto';
import { UserNotificationSetting } from '../entities/user-notification-setting.entity';
import { UserNotification } from '../entities/user-notification.entity';
import { UserNotificationSettingRepository } from '../repositories/user-notification-setting.repository';
import { UserNotificationRepository } from '../repositories/user-notification.repository';

@Injectable()
export class UserNotificationService {
  constructor(
    @InjectRepository(UserNotification)
    private userNotificationRepository: UserNotificationRepository,
    @InjectRepository(UserNotificationSetting)
    private userNotificationSettingRepository: UserNotificationSettingRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetchNotifications(data, options?: FindOneOptions): Promise<UserNotification[]> {
    return this.userNotificationRepository.find(data);
  }

  async updateNotification(
    notificationId: number,
    entity: UpdateUserNotificationRequestDto,
  ): Promise<UserNotification> {
    await this.userNotificationRepository.update(notificationId, entity);

    return this.findById(notificationId);
  }

  async findById(id: number): Promise<UserNotification> {
    return this.userNotificationRepository.findOne({ id }, { relations: ['toUser', 'fromUser'] });
  }

  async createUserNotification(entity: UserNotification): Promise<UserNotification> {
    const newRecord = await this.userNotificationRepository.save(entity);

    return this.userNotificationRepository.findOne(newRecord.id, { relations: ['toUser', 'fromUser'] });
  }

  createUserNotificationSetting(entity: CreateUserNotificationSettingDto): Promise<UserNotificationSetting> {
    return this.userNotificationSettingRepository.save(entity);
  }

  async deleteNotification(id: number): Promise<DeleteResult> {
    return this.userNotificationRepository.softDelete(id);
  }
}
