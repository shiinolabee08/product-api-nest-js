import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import * as CryptoJS from 'crypto-js';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    const bytes = CryptoJS.AES.decrypt(value, process.env.CRYPTO_SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  })
  password: string;
}
