import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindDiscountDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  perPage?: number;
}
