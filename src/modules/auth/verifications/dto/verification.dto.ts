import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';
import { VerificationTypes } from '../enums/verifications.enum';

export class VerificationDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  expireIn: string;

  @IsOptional()
  @IsEnum(VerificationTypes)
  type: VerificationTypes;
}
