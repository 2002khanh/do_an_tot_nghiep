import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsDateString,
} from 'class-validator';
import { IsEndDateAfterStartDate } from 'src/decorator/customize';

export class CreateDiscountDto {
  @IsNumberString()
  @IsNotEmpty()
  discount: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @IsEndDateAfterStartDate({ message: 'End date must be after start date' })
  endDate: string;
}
