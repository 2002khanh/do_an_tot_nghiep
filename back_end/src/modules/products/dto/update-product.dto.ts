import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  productName: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  detailProductId: string;

  @IsString()
  @IsOptional()
  subcategory: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  trademark: string;

  @IsNumber()
  @IsOptional()
  increaseTotalSold: number;

  @IsNumber()
  @IsOptional()
  quantity: number;
}
