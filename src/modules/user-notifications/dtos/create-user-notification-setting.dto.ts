import { IsNotEmpty } from 'class-validator';

export class CreateUserNotificationSettingDto {
  @IsNotEmpty()
  user: {
    id: number;
  };
}
