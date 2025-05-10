import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationTypeEnum } from '../../../common/enums/notification-type.enum';
/* import { FreshmarketerService } from '../../../common/services/freshmarketer.service';
import { SendFmTemplateTransactionRequestDto } from '../../fm-templates/dto/request/send-fm-template-transaction.request.dto';
 */
@Injectable()
export class EmailNotificationListener {
  private logger = new Logger(EmailNotificationListener.name);

  constructor(
    /* private freshmarketerService: FreshmarketerService, */
  ) {}

  @OnEvent(`${NotificationTypeEnum.EMAIL}.*`, { async: true })
  async handleEmailEvent(sendTransactionEmailRequestDto: any) {
    /* const response = await this.freshmarketerService.sendTransactionEmail(sendTransactionEmailRequestDto);

    if (!response) {
      this.logger.error(`Error occurred sending email notification to ${sendTransactionEmailRequestDto.recipient}`);
    } else {
      this.logger.log(`Successfully sent email notification to ${sendTransactionEmailRequestDto.recipient}`);
    } */
  }
}
