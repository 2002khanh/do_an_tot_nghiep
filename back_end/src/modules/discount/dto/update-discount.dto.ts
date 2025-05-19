import {
  IsArray,
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateDiscountDto {
  @IsNumberString()
  @IsOptional()
  discount?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  products?: string[];
}
