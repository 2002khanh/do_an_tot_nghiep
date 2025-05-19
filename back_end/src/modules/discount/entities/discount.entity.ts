import { Products } from 'src/modules/products/entities/product.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Discount {
  @PrimaryColumn()
  id: string;

  @ManyToMany(() => Products, (product) => product.discounts)
  products: Products[];

  @Column({
    default: null,
  })
  discount: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

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
  setDefaults() {
    if (!this.startDate) {
      this.startDate = new Date();
    }

    if (!this.endDate) {
      this.endDate = new Date();
    }
  }
}
