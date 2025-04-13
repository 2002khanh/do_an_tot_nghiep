import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDetailProductDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  quantity?: number;
}
