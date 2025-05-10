import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyResendRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
