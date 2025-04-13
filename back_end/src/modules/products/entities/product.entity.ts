import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { DetailProduct } from 'src/modules/detail-product/entities/detail-product.entity';
import { Discount } from 'src/modules/discount/entities/discount.entity';
import { OrderDetail } from 'src/modules/order_detail/entities/order_detail.entity';
import { ProductReview } from 'src/modules/product_review/entities/product_review.entity';
import { Subcategory } from 'src/modules/subcategory/entities/subcategory.entity';
import { Wishlist } from 'src/modules/wishlist/entities/wishlist.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Products {
  @PrimaryColumn()
  id: string;

  @Column()
  productName: string;

  @Column()
  image: string;

  @Column({
    default: '',
  })
  trademark: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    default: '',
  })
  detailName: string;

  @ManyToOne((type) => Subcategory, (subcategory) => subcategory.products)
  subcategory: Subcategory;

  @ManyToMany(() => Discount, (discount) => discount.products)
  @JoinTable()
  discounts: Discount[];

  @Column({
    default: 0,
  })
  rateAvg: number;

  @Column({
    default: 0,
  })
  rateTotal: number;

  @Column({
    default: 0,
  })
  totalSold: number;

  @Column({
    default: true,
  })
  isActive: boolean;

  @OneToMany((type) => DetailProduct, (detailProduct) => detailProduct.product)
  detailProducts: DetailProduct[];

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.product)
  wishList: Wishlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setDefaults() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
