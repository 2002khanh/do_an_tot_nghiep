import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discount]), ProductsModule],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService],
})
export class DiscountModule {}
