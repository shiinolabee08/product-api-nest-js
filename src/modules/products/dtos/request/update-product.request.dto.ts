import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateProductRequestDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  sku: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  imageUrl: string;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}