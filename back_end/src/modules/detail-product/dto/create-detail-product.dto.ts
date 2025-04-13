import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDetailProductDto {
  @IsArray()
  @IsNotEmpty()
  options: any[]; 

  @IsString()
  @IsNotEmpty()
  product: string;
}
