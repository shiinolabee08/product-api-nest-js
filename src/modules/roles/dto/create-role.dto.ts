import {
  IsNotEmpty, IsString, MaxLength, IsOptional,
} from 'class-validator';

export class CreateRoleDto {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
