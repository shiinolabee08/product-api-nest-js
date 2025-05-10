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
import { IsValidUkPostCode } from '../../../common/decorators/is-valid-uk-postcode.decorator';
import { Match } from '../../../common/decorators/match.decorator';
import { IsValidAge } from '../../../common/decorators/is-valid-age.decorator';
import { RolesEnum } from '../../../common/enums/roles.enum'
import { UserVerificationStatusEnum } from '../../../common/enums/user-verification-status.enum';

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
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

  @IsOptional()
  @IsDateString()
  @IsValidAge(16, {
    message: 'User must be at least be 16 years old.',
  })
  birthDate: string;

  @ValidateIf((o) => o.roleId === RolesEnum.PROJECT_OWNER, { always: true })
  @IsOptional()
  @IsValidUkPostCode()
  @MaxLength(10, {
    message: 'Post code is too long',
  })
  postcode: string;

  @ValidateIf((o) => o.roleId === RolesEnum.TRADESPERSON, { always: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  contactNo: string;

  @ValidateIf((o) => o.roleId === RolesEnum.TRADESPERSON, { always: true })
  @IsOptional()
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

  @IsOptional()
  @IsString()
  @MaxLength(255)
  latitude: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  longitude: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly referralCode;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  referredCode;

  @IsOptional()
  @IsEnum(RolesEnum)
  readonly roleId: RolesEnum;
}
