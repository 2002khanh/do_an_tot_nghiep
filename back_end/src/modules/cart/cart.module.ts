import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { ProductsModule } from '../products/products.module';
import { DetailProductModule } from '../detail-product/detail-product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductsModule, DetailProductModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
