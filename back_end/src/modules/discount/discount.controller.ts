import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { FindDiscountDto } from './dto/list-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(@Query() findDiscountDto: FindDiscountDto) {
    return this.discountService.findAll(findDiscountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
