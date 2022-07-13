import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticatePusherRequestDto {
  @IsNotEmpty()
  @IsString()
  socket_id: string;

  @IsNotEmpty()
  @IsString()
  channel_name: string;
}
