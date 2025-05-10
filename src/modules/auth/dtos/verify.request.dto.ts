import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyRequestDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
