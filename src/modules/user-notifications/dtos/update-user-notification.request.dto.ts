import { IsOptional, IsString } from 'class-validator';
import { NotificationStateEnum } from '../../../common/enums/notification-state.enum';

export class UpdateUserNotificationRequestDto {
  @IsOptional()
  @IsString()
  state: string | NotificationStateEnum;
}
