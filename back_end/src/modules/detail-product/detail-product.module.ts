import { forwardRef, Module } from '@nestjs/common';
import { DetailProductService } from './detail-product.service';
import { DetailProductController } from './detail-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailProduct } from './entities/detail-product.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailProduct]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [DetailProductController],
  providers: [DetailProductService],
  exports: [DetailProductService],
})
export class DetailProductModule {}
