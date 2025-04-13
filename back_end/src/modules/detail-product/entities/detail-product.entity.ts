import { Cart } from 'src/modules/cart/entities/cart.entity';
import { OrderDetail } from 'src/modules/order_detail/entities/order_detail.entity';
import { ProductReview } from 'src/modules/product_review/entities/product_review.entity';
import { Products } from 'src/modules/products/entities/product.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class DetailProduct {
  @PrimaryColumn()
  id: string;

  @Column()
  price: number;

  @Column({
    default: '',
  })
  content: string;

  @Column({
    default: 0,
  })
  quantity: number;

  @OneToMany((type) => Cart, (cart) => cart.detailProduct)
  cart: Cart[];

  @Column()
  @ManyToOne((type) => Products, (products) => products.detailProducts)
  product: string;

  @OneToMany(
    (type) => OrderDetail,
    (order_detail) => order_detail.detailProduct,
  )
  orderDetail: OrderDetail[];

  @OneToMany(
    (type) => ProductReview,
    (product_review) => product_review.product,
  )
  productReview: ProductReview[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
