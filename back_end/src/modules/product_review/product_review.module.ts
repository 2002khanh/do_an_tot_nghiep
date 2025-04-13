import { Module } from '@nestjs/common';
import { ProductReviewService } from './product_review.service';
import { ProductReviewController } from './product_review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from './entities/product_review.entity';
import { OrderModule } from '../order/order.module';
import { OrderDetailModule } from '../order_detail/order_detail.module';
import { ProductsModule } from '../products/products.module';
import { DetailProductModule } from '../detail-product/detail-product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReview]),
    OrderModule,
    OrderDetailModule,
    ProductsModule,
    DetailProductModule,
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
})
export class ProductReviewModule {}
