import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsDateString,
  Matches,
  IsEmail,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as CryptoJS from 'crypto-js';
import { IsValidUkPostCode } from 'src/common/decorators/is-valid-uk-postcode.decorator';
import { Match } from 'src/common/decorators/match.decorator';
import { IsValidAge } from 'src/common/decorators/is-valid-age.decorator';
import { UserVerificationStatusEnum } from 'src/common/enums/user-verification-status.enum';

export class CreateUserRequestDto {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    const bytes = CryptoJS.AES.decrypt(value, process.env.CRYPTO_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  })
  // eslint-disable-next-line no-useless-escape
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[=+\-^$*.\[\]{}()?"!@#%&/\\,><':;|_~`])\S{8,99}$/, {
    message:
      'Password requires 1 uppercase character, 1 lower case character and 1 symbol.',
  })
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => {
    const bytes = CryptoJS.AES.decrypt(value, process.env.CRYPTO_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  })
  @Match('password')
  confirmPassword: string;

  @IsDateString()
  @IsValidAge(16, {
    message: 'User must be at least be 16 years old.',
  })
  birthDate: string;

  @IsNotEmpty()
  @IsValidUkPostCode()
  @MaxLength(50, {
    message: 'Post code is too long',
  })
  postcode: string;

  @IsNotEmpty()
  @IsString()
  contactNo: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50, {
    message: 'Address is too long',
  })
  address: string;

  @IsNotEmpty()
  @IsBoolean()
  tcOptIn: boolean;

  @IsNotEmpty()
  @IsBoolean()
  marketingOptIn: boolean;

  @IsOptional()
  @IsString()
  userVerificationStatus: UserVerificationStatusEnum;
}
