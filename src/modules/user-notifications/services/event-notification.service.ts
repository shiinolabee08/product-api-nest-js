import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationTypeEnum } from '../../../common/enums/notification-type.enum';
import { SendFmTemplateTransactionRequestDto } from '../../fm-templates/dto/request/send-fm-template-transaction.request.dto';
import { UserNotification } from '../entities/user-notification.entity';

@Injectable()
export class EventNotificationService {
  constructor(
    private eventEmitter: EventEmitter2,
  ) {}

  async sendEmailNotificationEvent(
    eventName: string,
    payload: SendFmTemplateTransactionRequestDto,
  ) {
    this.eventEmitter.emit(`${NotificationTypeEnum.EMAIL}.${eventName}`, payload);
  }

  async sendInAppNotificationEvent(
    eventName: string,
    userNotification: UserNotification,
    channel: string,
  ) {
    this.eventEmitter.emit(`${NotificationTypeEnum.IN_APP}.${eventName}`, userNotification, channel);
  }
}
